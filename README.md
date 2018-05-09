# holyc

## Installation

```sh
npm install -g holyc
```

The first installation will be slow.

## Usage for C++

```sh
holyc++ path/to/something.cpp
```

The `WASM` binary will then be available at `something.cpp.wasm`.

### Options

|name|description|
|---|---|
|`--show-wast`|Show wast output|
|`--no-clean`|Disable cleaning of intermediate formats|

## FAQ

### How does it compare to Emscripten

Emscripten is able to compile the libc where Holyc won't.

You can easily reproduce this benchmark by following [C_to_wasm](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm).

hello.c:

```c
int main() {
  return 0;
}
```

Emscripten:

| file | size (bytes) |
|---|---|
| hello.wasm | 21856 |
| hello.js (loader) | 99710 |

Holyc:

| file | size (bytes) |
|---|---|
| hello.wasm | 78 |
| hello.js (loader) | unknown currently (see [here](https://github.com/xtuc/holyc/blob/master/examples/dom/index.html#L20-L52) for a hint) |
