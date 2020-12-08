#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
  const source = parseHrefOrFile(process.argv[2]);
  const destination = parseHrefOrFile(process.argv[3]);

  let sourceData;
  if (source.type === 'file') {
    sourceData = await fs.promises.readFile(source.value, 'utf8').then(JSON.parse);
  } else {
    sourceData = await extract(source.value);
  }

  if (destination.type === 'file') {
    await fs.promises.writeFile(destination.value, JSON.stringify(sourceData, null, 2));
  } else {
    const restoreResult = await restore(sourceData, destination.value);

    if (restoreResult.find(result => result instanceof Error)) {
      throw new Error('could not insert all documents');
    }
  }
}

main();
