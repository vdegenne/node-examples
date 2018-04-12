import * as chai from 'chai';
// import * as chaiAsPromised from 'chai-as-promised';
import * as express from 'express';
import * as path from 'path';
import * as send from 'send';
import * as supertest from 'supertest';
import intercept = require('intercept-stdout');

import * as makeApp from '../make-app';

// chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;

const root = path.join(__dirname, '..', '..', 'test');


/**
 * BASIC EXPRESS
 */
suite('Basic express', () => {
  test('set "content-type" accordingly', async() => {
    // make the app
    const app = express();

    app.get('/json', (req, res) => {
      res.send({value: 12});
    });

    await supertest(app).get('/json').expect(200).expect(
        'content-type', /json/);
  });

  test(`can't override a 'get' already set (without next)`, async() => {
    // make the app
    const app = express();
    app.get('*', (req, res) => {
      res.send('first get');
    });

    // won't override
    app.get('*', (req, res) => {
      res.send('second get');
    });

    // test
    await supertest(app).get('/anything').expect(200, 'first get');
  });


  test(
      `Several matching routes won't get executed unless there's a 'next'`,
      async() => {
        // make the app
        const app = express();
        // specific get
        app.get('/path/to/resource', (req, res) => {
          res.send('specific');
          // always needs a next to pass from a route to another
        });
        // global get
        app.get('/*', (req, res) => {
          res.send('global');
        });

        // Test :
        // the following line will only call '/path/to/resource' route even
        // though the route '/*' is also matched because routes are called in
        // order of definition and if the next keyword is not used, the route
        // chain is stopped.
        await supertest(app).get('/path/to/resource').expect(200, 'specific');
        await supertest(app).get('/anything').expect(200, 'global');
      });

  test(`redefines the write function of a Response`, async() => {
    const app = express();
    app.get('*', (req, res) => {
      res.write = function(
          chunk: Buffer|string,
          cbOrEncoding?: Function|string,
          cbOrFd?: Function|string): boolean {
        return false;
      };
    });
  });
});


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
    await supertest(app).get('/test').expect(301).expect('location', '/test/');
  });

  test('SendApp serves the indices', async() => {
    const app = makeApp.makeSendApp();
    await supertest(app).get('/test/').expect(200, /^Lorem/);
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



  test(
      `'send' in a 'get' chain doesn't clog the process but many 'send' in the chain not permitted.`,
      (done) => {
        // make the app
        const app = express();
        // first get
        app.get('*', (req, res, next) => {
          res.send('first get');
          next();
        });
        // second get
        app.get('*', (req, res) => {
          try {
            res.send('second get');
          } catch (err) {
            // this error is expected because the first 'send' already sent
            // headers
            done();
            return;
          }
          done(new Error('not expected'));
        });

        // test
        (async() => {
          await supertest(app).get('/anything');
        })();
      });


  test(
      `middlewares and 'get's execute in the order they've been defined.`,
      async() => {
        const app = express();
        let stdout = '';
        let unintercept = intercept((txt) => {
          stdout += txt;
          return '';
        });

        app.get('*', (req, res, next) => {
          console.log(2);
          next();
        });

        app.use('*', (req, res, next) => {
          console.log(1);
          next();
        });

        await supertest(app).get('/anything').then((result) => unintercept());
        assert.equal(stdout, '2\n1\n');
        // middleware 'use' doesn't get executed before 'get' :
        assert.notEqual(stdout, '1\n2\n');
      });
});



suite(`Module 'send'`, () => {

  test(`'send' sets "content-type" accordingly`, async() => {
    // make the app
    const app = express();

    app.get('/json', (req, res) => {
      send(req, path.join(root, 'test.json')).pipe(res);
    });

    await supertest(app).get('/json').expect(200).expect(
        'content-type', /json/);
  });



  test(`many piping won't raise an Error`, (done) => {
    // make the app
    const app = express();
    app.get('*', (req, res, next) => {
      // send the foo.html file in public
      send(req, path.join(root, 'foo.html')).pipe(res);
      next();
    });
    // second get
    app.get('*', (req, res) => {
      // send the same file
      try {
        // piping doesn't set header right away, instead it waits the very ends
        // to set the headers and send the response. No exception will be raised
        // here then.
        send(req, path.join(root, 'test.json')).pipe(res);
      } catch (err) {
        done(new Error('not expected'));
        return;
      }
      done();
    });

    // test
    (async() => {
      const response = await supertest(app).get('/anything');
    })();

  });


  test(`first piping takes precedence`, async() => {
    // make the app
    const app = express();
    app.get('*', (req, res, next) => {
      // send the foo.html file in test
      send(req, path.join(root, 'foo.html')).pipe(res);
      next();
    });
    // second get
    app.get('*', (req, res) => {
      // won't have any effect
      send(req, path.join(root, 'test.json')).pipe(res);
    });

    // test
    await supertest(app).get('/anything').expect(200, 'bar\n');
  });


  /*   test('serves indices', async() => {
      // make the app
      const app = express();
      app.get(
          '*',
          (req, res) => {
              // pipe stream
                    send(req, ).pipe(res);
          });

      // test
      await supertest(app).get('/anything').expect(200);
    }); */
});



/**
 * In short :
 * many routes can be defined and they form a route chain. Many routes matched
 * by a URL is forming a new route chain and the route chain always executes in
 * order as the routes were defined in the code. Every node of the chain needs
 * to use the 'next' keyword in order to travel the chain, if the 'next' keyword
 * is missing from a node, the execution is stopped.
 */
