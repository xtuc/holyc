let memview;

const utf8decoder = new TextDecoder('utf-8');

function assertHasMemory() {
  if (typeof memview === "undefined") {
    throw new Error("Missing memory");
  }
}

function getStringByteBuffer(start) {
  assertHasMemory();

  let bytes = [];
  let p = start;

  while (true) {
    const b = memview.getUint8(p)
    p++;

    if (b === 0) {
      break;
    }

    bytes.push(b);
  }

  return new Uint8Array(bytes);
}

function console_log(p) {
  const bytes = getStringByteBuffer(p);
  const text = utf8decoder.decode(bytes);

  console.log(text);
}

module.exports = {
  init(mem) {
    memview = new DataView(mem.buffer);
  },

  console_log
};
