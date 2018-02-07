svn co http://llvm.org/svn/llvm-project/llvm/trunk /tmp/llvm-go

cd /tmp/llvm-go/tools
svn co http://llvm.org/svn/llvm-project/cfe/trunk clang
svn co http://llvm.org/svn/llvm-project/llgo/trunk llgo

mkdir /tmp/llvm-go-build
cd /tmp/llvm-go-build
cmake /tmp/llvm-go -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly
make -j$(nproc)

