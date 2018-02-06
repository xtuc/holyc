#ifndef JS_H_
#define JS_H_

#define EXPORT extern "C"

EXPORT void consolelog(int msg);

namespace js {
    namespace console {
        void log(int);
    };
}

#endif

