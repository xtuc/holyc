const {execFileSync} = require('child_process');
const {unlink, writeFileSync, readFileSync} = require('fs');

module.exports = function(source) {
  writeFileSync(".tmp.c", source);

  execFileSync("./node_modules/.bin/holyc", [
    ".tmp.c"
  ]);

  const out = readFileSync(".tmp.c.wasm", null);
  this.callback(null, out);

  unlink(".tmp.c");
  unlink(".tmp.c.wasm");
};
