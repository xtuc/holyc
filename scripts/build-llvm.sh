#!/bin/sh

tarball_url=http://releases.llvm.org/5.0.1/llvm-5.0.1.src.tar.xz
download_location=/tmp/llvm-5.0.1.src.tar.xz
source_location=/tmp/llvm-5.0.1.src
build_dir=./llvmwasm-build

wget $tarball_url -O $download_location

mkdir -p $source_location
tar -xf $download_location -C $source_location --strip-components=1

mkdir -p $build_dir

cd $build_dir

cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=$build_dir -DLLVM_TARGETS_TO_BUILD= -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly $source_location
make -j 4
