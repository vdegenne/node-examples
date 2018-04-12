import {assert, expect} from 'chai';
import * as express from 'express';
import * as supertest from 'supertest';

import * as makeApp from '../make-app';

suite('Start Server', () => {

  test('returns "this is cool"', async() => {
    const app = makeApp.makeApp();
    await supertest(app).get('/cool').expect(200, 'this is cool');
  });


  test('returns "yo"', async() => {
    const app = makeApp.makeApp();
    await supertest(app).get('/test/yo').expect(200, 'yo');
  });


  test('having fun with directories', async() => {
    const app = makeApp.makeApp();
    await supertest(app).get('/directory');
  });

  test(
      'SendApp returns a 404 error message when a resource is not found',
      async() => {
        const app = makeApp.makeSendApp();
        await supertest(app).get('/doesnt-exist').expect(404);
      });

  test('SendApp redirects the directories', async() => {
    const app = makeApp.makeSendApp();
    await supertest(app).get('/public').expect(301).expect(
        'location', '/public/');
  });

  test('SendApp serves the indices', async() => {
    const app = makeApp.makeSendApp();
    await supertest(app).get('/public/').expect(200, /^Lorem/);
  });


  test('get overrides get', async() => {
    const app = makeApp.overlappingGetsApp();

    await supertest(app).get('/anything').expect(200).expect((res: any) => {
      expect(res.text).to.have.string('first get');
      expect(res.text).not.to.have.string('second get');
    })
  });



  test('middleware cut urls', async() => {
    // define an app
    const app = express();
    app.get('*', (req, res) => {
      res.send(req.url);
    });

    // define the middleware
    const middleware = express();
    middleware.use('/middleware/', app);

    // test
    await supertest(middleware)
        .get('/middleware/test.html')
        .expect(200, '/test.html');
  });
});
