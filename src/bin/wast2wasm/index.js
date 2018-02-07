#!/usr/bin/node

const {readFileSync, writeFileSync} = require('fs');
const filename = process.argv[2];
const outputfile = process.argv[3];

const libwabt = require('./libwabt');
const fileContent = readFileSync(filename, "utf8");

const m = libwabt.parseWat(filename, fileContent);

m.resolveNames();
m.validate();

const {buffer} = m.toBinary({log: true, write_debug_names:true});

writeFileSync(outputfile, new Buffer(buffer));
