#!/bin/sh -xe

filename=$1
libcxx_dir=./libcxx

clang++ \
    -S \
    -emit-llvm \
    --target=wasm64 \
    -c \
    -Oz \
    "$filename" \
    -o ".$filename.bc"

./llvmwasm-build/bin/llc ".$filename.bc" -o ".$filename.s"

./binaryen-1.37.33/s2wasm \
    ".$filename.s" > ".$filename.wast"

./wast2wasm/index.js ".$filename.wast" "$filename.wasm"

cat ".$filename.wast"
du -sh "$filename.wasm"

rm -f ".$filename.bc" ".$filename.s" ".$filename.wast"
