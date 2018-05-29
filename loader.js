const {execFileSync} = require('child_process');
const {unlink, writeFileSync, readFileSync} = require('fs');
const {edit, add} = require("@webassemblyjs/wasm-edit");
const t = require("@webassemblyjs/ast");

function transformWasm(bin) {
  // bin = edit(bin, {
  //   ModuleExport(path) {
  //     const descr = path.node.descr;

  //     if (descr.exportType === "Mem") {
  //       path.remove();
  //     }

  //   }
  // });

  // const moduleImport = t.moduleImport(
  //   "holycjs", "mem",
  //   t.memory(t.limit(1))
  // );

  // bin = add(bin, [moduleImport]);

  return bin;
}


module.exports = function(source) {
  writeFileSync(".tmp.c", source);

  execFileSync("./node_modules/.bin/holyc", [
    ".tmp.c"
  ]);

  const bin = readFileSync(".tmp.c.wasm", null);
  const newBin = transformWasm(bin);

  this.callback(null, new Buffer(newBin));

  unlink(".tmp.c");
  unlink(".tmp.c.wasm");
};
