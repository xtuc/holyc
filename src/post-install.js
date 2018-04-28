const https = require('https');
const Multiprogress = require('multi-progress');
const fs = require('fs');
const {join} = require('path');
const mkdirp = require('mkdirp');

const multi = new Multiprogress(process.stdout);

function downloadTo(url, writeStream) {
  https.get(url, res => {
    res.pipe(writeStream)

    if (res.statusCode !== 200) {
      throw new Error(url + " returned status " + res.statusCode);
    }

    const totalLength = parseInt(res.headers['content-length']);
    let downloaded = 0;

    const bar = multi.newBar('  downloading ' +  url + ' [:bar] :percent', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: totalLength
    });

    res.on('data', function (chunk) {
      bar.tick(chunk.length);
    });

    res.on('end', function() {});
  });
}

function download(binaries, dest) {
  const keys = Object.keys(binaries);

  keys.forEach(key => {
    const filename = join(dest, key);
    const file = fs.createWriteStream(filename);
    const url = binaries[key];

    downloadTo(url, file);

    fs.chmodSync(filename, 0700);
  });
}

const baseUrl = 'https://s3.eu-central-1.amazonaws.com/holyc/';

const binaries = {
  s2wasm: baseUrl + 's2wasm',
  llc: baseUrl + 'llc',
  clang: baseUrl + encodeURIComponent('clang++'),
};

const dest = join(__dirname, "..", ".bin");
mkdirp.sync(dest);

download(binaries, dest);
