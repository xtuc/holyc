#!/bin/sh

cache_dir=~/.holyc

# Create cache dir
mkdir -p $cache_dir

sh -x ./scripts/build-llvm.sh $cache_dir
sh -x ./scripts/download-binaryen.sh $cache_dir
