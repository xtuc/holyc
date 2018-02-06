#include "include/js.h"

EXPORT int add(int x, int y) {
    return x + y;
}

EXPORT void test() {
    js::console::log(13);
}
