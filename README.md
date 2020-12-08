# restractor
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/restractor?style=flat-square)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/restractor?style=flat-square)](https://github.com/markwylde/restractor/blob/master/package.json)
[![GitHub](https://img.shields.io/github/license/markwylde/restractor?style=flat-square)](https://github.com/markwylde/restractor/blob/master/LICENSE)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)

A library and CLI to extract and restore data from REST api's.

## Installation
```bash
npm install --save restractor
```

## Usage
### CLI
```bash
# Download from a rest endpoint and save to a file
restractor http://localhost:42597/notes ./notes.json

# Download from a file and post to a rest endpoint
restractor notes.json http://localhost:42597/notes1

# Download from a rest endpoint and post to another rest endpoint
restractor http://localhost:42597/notes http://localhost:42597/notes1
```

### Extracting data
```javascript
const fs = require('fs');
const restractor = require('restractor');

restractor.extract('http://localhost:8000/api/notes', function (error, notes) {
  fs.writeFileSync('./notes.json', notes);
});
```

### Restoring data
```javascript
const fs = require('fs');
const restractor = require('restractor');

const notes = fs.readFileSync('./notes.json', 'utf8');
restractor.restore(notes, 'http://localhost:8000/api/notes');
```
