cd lib/binaryen;

cmake -DCMAKE_BUILD_TYPE=Release .
make -j$(nproc)
