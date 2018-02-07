#!/usr/bin/node

const cp = require('child_process');
const rimraf = require('rimraf');
const {basename} = require('path');
const {writeFileSync, mkdtempSync} = require('fs');
const {homedir} = require('os');

const wast2wasm = require('./wast2wasm');

function seq(...fns) {
  return fns.reverse().reduce((prevFn, nextFn) =>
    value => nextFn(prevFn(value)),
    value => value
  );
}

const cacheDir = homedir() + '/.holyc';

const bc = ({tempDir, inputFilename}) => `${tempDir}/${basename(inputFilename)}.bc`;
const s = ({tempDir, inputFilename}) => `${tempDir}/${basename(inputFilename)}.s`;
const wast = ({tempDir, inputFilename}) => `${tempDir}/${basename(inputFilename)}.wast`;
const wasm = ({inputFilename}) => `${inputFilename}.wasm`;

function clangppCompile(opts) {
  console.log('clangppCompile', opts.inputFilename);

  cp.execFileSync('/usr/bin/clang++', [
    '-S',
    '-emit-llvm',
    '--target=wasm64',
    '-c',
    '-Oz',
    opts.inputFilename,
    '-o', bc(opts)
  ]);

  return opts;
}

function llvmStaticlyCompile(opts) {
  console.log('llvmStaticlyCompile', bc(opts));

  cp.execFileSync(cacheDir + '/llvmwasm-build/bin/llc', [
    bc(opts),
    '-o', s(opts)
  ]);

  return opts;
}

function s2wasmCompile(opts) {
  console.log('s2wasmCompile', s(opts));

  const out = cp.execFileSync(cacheDir + '/binaryen-1.37.33/s2wasm', [
    s(opts)
  ]);

  writeFileSync(wast(opts), out.toString("utf8"), {encoding: "utf8"});

  return opts;
}

function wast2wasmCompile(opts) {
  console.log('wast2wasmCompile', wast(opts));

  wast2wasm(wast(opts), wasm(opts));

  return opts;
}

function clean(opts) {
  console.log('clean');

  rimraf.sync(opts.tempDir);

  return opts;
}

function compile(inputFilename) {
  const run = seq(
    clean,
    wast2wasmCompile,
    s2wasmCompile,
    llvmStaticlyCompile,
    clangppCompile
  );

  const tempDir = mkdtempSync('holyc_');

  run({
    inputFilename,
    tempDir
  });
}

compile(process.argv[2]);
