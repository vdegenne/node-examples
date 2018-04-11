import {assert} from 'chai';
import * as supertest from 'supertest';
import {makeApp, makeSendApp} from '../make-app';

suite('Start Server', () => {

  test('returns "this is cool"', async() => {
    const app = makeApp();
    await supertest(app).get('/cool').expect(200, 'this is cool');
  });


  test('returns "yo"', async() => {
    const app = makeApp();
    await supertest(app).get('/test/yo').expect(200, 'yo');
  });


  test('having fun with directories', async() => {
    const app = makeApp();
    await supertest(app).get('/directory');
  });

  test(
      'SendApp returns a 404 error message when a resource is not found',
      async() => {
        const app = makeSendApp();
        await supertest(app).get('/doesnt-exist').expect(404);
      });

  test('SendApp redirects the directories', async() => {
    const app = makeSendApp();
    await supertest(app).get('/public').expect(301).expect(
        'location', '/public/');
  });

  test('SendApp serves the indices', async() => {
    const app = makeSendApp();
    await supertest(app).get('/public/').expect(200, /^Lorem/);
  });
});
