// here are the main exports
import {Readable, ReadableOptions, Transform, TransformOptions, Writable, WritableOptions} from 'stream';

export class MyReadableStream extends Readable {
  private str: string;

  constructor(str: string, opts?: ReadableOptions) {
    super(opts);
    this.str = str;
  }

  _read(size: number) {
    let chunk = this.str.slice(0, size);

    if (chunk) {
      this.str = this.str.slice(size);
      this.push(chunk);
    } else {
      this.push(null);
    }
  }
}

export class MyWritableStream extends Writable {
  private str: string;

  constructor(opts?: WritableOptions) {
    super(opts);
    this.str = '';
  }

  _write(chunk: any, encoding: string, callback: (err?: Error) => void): void {
    this.str += chunk.toString();
    callback();
  }

  getString() {
    return this.str;
  }
}


export class MyTransformStream extends Transform {
  private fromRegExp: RegExp;
  private to: string;

  constructor(from: string, to: string, opts?: TransformOptions) {
    super(opts);
    this.fromRegExp = new RegExp(`%${from}%`, 'g');
    this.to = to;
  }

  _transform(chunk: any, enc: string, cb: Function) {
    this.push(chunk.toString().replace(this.fromRegExp, this.to));
    cb();
  }
}
