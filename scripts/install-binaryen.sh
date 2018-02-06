#!/bin/sh
download_url=https://github.com/WebAssembly/binaryen/releases/download/1.37.33/binaryen-1.37.33-x86_64-linux.tar.gz
download_location=/tmp/binaryen-1.37.33.tar.gz
bin_location=./binaryen-1.37.33

wget $download_url -O $download_location

mkdir -p $bin_location

tar -xf $download_location -C $bin_location --strip-components=1
