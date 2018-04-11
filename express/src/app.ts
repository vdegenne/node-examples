#!/usr/bin/env node

import * as makeApp from './make-app';

const app = makeApp.makeSendApp();

app.listen(3000, () => {
  console.log('ready');
});
