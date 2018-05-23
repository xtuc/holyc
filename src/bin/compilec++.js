#!/usr/bin/node

const cp = require('child_process');
const rimraf = require('rimraf');
const Multiprogress = require('multi-progress');
const {basename, join} = require('path');
const {writeFileSync, mkdtempSync, openSync} = require('fs');
const program = require('commander');

program
  .option('--show-wast', 'Show wast output')
  .option('--no-clean', 'Disable cleaning of intermediate formats')
  .parse(process.argv);

const includeDir = join(__dirname, "..", "..", "include");
const binsDir = join(__dirname, "..", "..", ".bin");

const multi = new Multiprogress(process.stdout);

if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength,padString) {
    targetLength = targetLength>>0; //floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (this.length > targetLength) {
      return String(this);
    }
    else {
      targetLength = targetLength-this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0,targetLength);
    }
  };
}

function seq(...fns) {
  return fns.reverse().reduce((prevFn, nextFn) =>
    value => nextFn(prevFn(value)),
    value => value
  );
}

function noop(opts) {
  return opts;
}

const bc = ({tempDir, inputFilename}) => `${tempDir}/${basename(inputFilename)}.bc`;
const s = ({tempDir, inputFilename}) => `${tempDir}/${basename(inputFilename)}.s`;
const wasm = ({inputFilename}) => `${inputFilename}.wasm`;

function newBar(msg, total = 100) {
  msg = msg.padEnd(30);

  const bar = multi.newBar('  ' + msg + ' [:bar] :percent', {
    complete: '=',
    incomplete: ' ',
    width: 40,
    total
  });

  return bar;
}

function clangppCompile(opts) {
  const bar = newBar('compile');

  cp.execFileSync(join(binsDir, 'clang'), [
    '-S',
    '-emit-llvm',
    '--target=wasm32',
    '-fno-builtin',
    '-nostdinc',
    '-nostdlib',
    '-O3',
    '-c',
    '-I', includeDir,

    opts.inputFilename,
    '-o', bc(opts)
  ]);

  bar.tick(100);

  return opts;
}

function llvmStaticlyCompile(opts) {
  const bar = newBar('statically compile');

  cp.execFileSync(join(binsDir, 'llc'), [
    bc(opts),
    '-o', s(opts)
  ]);

  bar.tick(100);

  return opts;
}

function s2wasmCompile(opts) {
  const bar = newBar('finalize wasm');

  cp.execFileSync(join(binsDir, 's2wasm'), [
    '--emit-binary',
    s(opts),
    '-o', wasm(opts)
  ]);

  bar.tick(100);

  return opts;
}

function showWast(opts) {
  const bar = newBar('show wast');

  const stdio = [
    0, // parent stdin
    process.stdout,
    0, // parent stderr
  ];

  const out = cp.execFileSync(join(binsDir, 's2wasm'), [
    s(opts),
  ], {stdio});

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
    program.showWast === true ? showWast : noop,

    s2wasmCompile,
    llvmStaticlyCompile,
    clangppCompile
  );

  const tempDir = mkdtempSync('holyc_');

  try {
    run({
      inputFilename,
      tempDir
    });
  } finally () {
    if (program.clean === true) {
      clean({
        inputFilename,
        tempDir
      });
    }
  }
}

compile(process.argv[2]);
