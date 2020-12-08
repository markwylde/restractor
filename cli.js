#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const argv = require('minimist')(process.argv.slice(2));
const extract = require('./extract');
const restore = require('./restore');

function parseHrefOrFile (string) {
  const protocol = string.startsWith('http') ? 'http' : 'file';

  if (protocol === 'file') {
    return { type: protocol, value: path.resolve(process.cwd(), string) };
  }

  return { type: protocol, value: string };
}

async function main () {
  const source = parseHrefOrFile(argv._[0]);
  const destination = parseHrefOrFile(argv._[1]);

  const sourceOptions = {};
  if (argv['source-cert']) {
    sourceOptions.httpsAgent = new https.Agent({
      key: fs.readFileSync(path.resolve(process.cwd(), argv['source-key'])),
      cert: fs.readFileSync(path.resolve(process.cwd(), argv['source-cert'])),
      ca: [fs.readFileSync(path.resolve(process.cwd(), argv['source-ca']))],
      requestCert: true
    });
  }

  const destOptions = {};
  if (argv['dest-cert']) {
    destOptions.httpsAgent = new https.Agent({
      key: fs.readFileSync(path.resolve(process.cwd(), argv['dest-key'])),
      cert: fs.readFileSync(path.resolve(process.cwd(), argv['dest-cert'])),
      ca: [fs.readFileSync(path.resolve(process.cwd(), argv['dest-ca']))],
      requestCert: true
    });
  }

  let sourceData;
  if (source.type === 'file') {
    sourceData = await fs.promises.readFile(source.value, 'utf8').then(JSON.parse);
  } else {
    sourceData = await extract(source.value, sourceOptions);
  }

  if (destination.type === 'file') {
    await fs.promises.writeFile(destination.value, JSON.stringify(sourceData, null, 2));
  } else {
    const restoreResult = await restore(sourceData, destination.value, destOptions);

    if (restoreResult.find(result => result instanceof Error)) {
      throw new Error('could not insert all documents');
    }
  }
}

main();
