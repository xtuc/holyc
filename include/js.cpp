#define EXPORT extern "C"

using handle_t = int;

namespace js {
    namespace console {
        void log(int);
    }

    namespace document {
      handle_t body;
      handle_t createElement();
      void appendChild(handle_t, handle_t);
    }
}

using namespace js;

extern "C" void console$log(int);
extern "C" handle_t document$createElement();
extern "C" handle_t document$body();
extern "C" void document$appendChild(handle_t, handle_t);

void console::log(int msg) {
    console$log(msg);
}

handle_t document::createElement() {
  return document$createElement();
}

void document::appendChild(handle_t target, handle_t element) {
  document$appendChild(target, element);
}

