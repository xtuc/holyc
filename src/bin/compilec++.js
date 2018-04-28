#!/usr/bin/node

const cp = require('child_process');
const rimraf = require('rimraf');
const Multiprogress = require('multi-progress');
const {basename, join} = require('path');
const {writeFileSync, mkdtempSync} = require('fs');

const binsDir = join(__dirname, "..", "..", ".bin");

const multi = new Multiprogress(process.stdout);

function seq(...fns) {
  return fns.reverse().reduce((prevFn, nextFn) =>
    value => nextFn(prevFn(value)),
    value => value
  );
}

const bc = ({tempDir, inputFilename}) => `${tempDir}/${basename(inputFilename)}.bc`;
const s = ({tempDir, inputFilename}) => `${tempDir}/${basename(inputFilename)}.s`;
const wasm = ({inputFilename}) => `${inputFilename}.wasm`;

function newBar(msg, total = 100) {
  const bar = multi.newBar('  ' + msg + ' [:bar] :percent', {
    complete: '=',
    incomplete: ' ',
    width: 40,
    total
  });

  return bar;
}

function clangppCompile(opts) {
  const bar = newBar('clangppCompile');

  cp.execFileSync(join(binsDir, 'clang'), [
    '-S',
    '-emit-llvm',
    '--target=wasm64',
    '-c',
    '-Oz',
    opts.inputFilename,
    '-o', bc(opts)
  ]);

  bar.tick(100);

  return opts;
}

function llvmStaticlyCompile(opts) {
  const bar = newBar('llvmStaticlyCompile');

  cp.execFileSync(join(binsDir, 'llc'), [
    bc(opts),
    '-o', s(opts)
  ]);

  bar.tick(100);

  return opts;
}

function s2wasmCompile(opts) {
  const bar = newBar('s2wasmCompile');

  cp.execFileSync(join(binsDir, 's2wasm'), [
    '--emit-binary',
    s(opts),
    '-o', wasm(opts)
  ]);

  bar.tick(100);

  return opts;
}

function clean(opts) {
  const bar = newBar('clean');

  rimraf.sync(opts.tempDir);

  bar.tick(100);

  return opts;
}

function compile(inputFilename) {
  const run = seq(
    clean,
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
