const {readFileSync, writeFileSync} = require('fs');
const libwabt = require('./libwabt');

module.exports = function (filename, outputfile) {
  const fileContent = readFileSync(filename, "utf8");

  const m = libwabt.parseWat(filename, fileContent);

  m.resolveNames();
  m.validate();

  const {buffer} = m.toBinary({log: true, write_debug_names:true});

  writeFileSync(outputfile, new Buffer(buffer));
}
