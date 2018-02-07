#define EXPORT extern "C"
#define IMPORT extern "C"

namespace js {
    namespace console {
        void log(char* str[]);
    }
}

using namespace js;

extern "C" void consolelog(char* str[]);

void console::log(char* str[]) {
    consolelog(str);
}
