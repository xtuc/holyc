#!/bin/sh
filename=$1

clang -S -emit-llvm --target=wasm64 $filename -Oz -c -o ".$filename.bc"
./llvmwasm-build/bin/llc ".$filename.bc" -o ".$filename.s"
./binaryen-1.37.33/s2wasm ".$filename.s" > out.wast

rm ".$filename.bc"
rm ".$filename.s"
