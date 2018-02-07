#include "../../c/include/js.cpp"

EXPORT void test() {
  js::console::log(1);

  handle_t e1 = js::document::createElement();
  js::document::appendChild(js::document::body, e1);
}
