#ifndef import_js
#define import_js(module, name) __asm__("	.import_module "#module", "#name"");
#endif

