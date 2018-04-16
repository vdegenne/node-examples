import * as chai from 'chai';
import {createWriteStream} from 'fs';
import {Readable, Writable} from 'stream';

import {MyReadableStream, MyWritableStream} from '../streams-example';

const assert = chai.assert;

suite('Streams', () => {
  let title = '';

  title = 'Creates a custom readable stream and ' +
      'pipes it in a custom writable stream.'
  test(title, () => {
    // create the data
    const str = 'hello world';
    const outStream = new MyReadableStream(str);
    const inStream = new MyWritableStream();

    // assert when the readable stream passes all the data
    outStream.on('end', () => {
      assert.equal(inStream.getString(), 'hello world');
    });

    // do the piping
    outStream.pipe(inStream);
  });

  title = 'Do like the previous test but without a custom readable stream';
  test(title, () => {
    // create the data
    const str = 'hi sweet world';
    const outStream = new Readable;
    const inStream = new MyWritableStream;

    // we aggregate the outStream with some strings
    outStream.push(str);
    outStream.push(null);

    // on end
    outStream.on('end', () => {
      assert.equal(inStream.getString(), str);
    });

    // do the piping
    outStream.pipe(inStream);
  });


  title = 'Do like the previous test but without a custom readable stream' +
      'and an on-the-fly custom writable stream';
  test(title, () => {
    // create the data
    const str = 'welcome in the real world';
    const outStream = new Readable;
    // aggregate the outStream
    outStream.push(str);
    outStream.push(null);

    // on-the-fly custom writable stream
    let _str = '';
    const inStream = new Writable;
    inStream._write = function(chunk, encoding, cb) {
      _str += chunk.toString();
      cb();
    };

    // assert
    outStream.on('end', () => {
      assert.equal(_str, str);
    });

    // do the piping
    outStream.pipe(inStream);
  });
});
