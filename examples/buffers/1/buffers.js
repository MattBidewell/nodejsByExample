// <b>Buffers</b> represent fixed-length sequences of bytes. They're used for handling binary data like files, network packets, and images.


// <b>Creating Buffers</b>
// There are several ways to create buffers.

// From string (most common)
const buf1 = Buffer.from('Hello World');
console.log('From string:', buf1);
console.log('As string:', buf1.toString());

// From array of bytes
const buf2 = Buffer.from([72, 101, 108, 108, 111]); // ASCII for "Hello"
console.log('From array:', buf2.toString());

// Allocate empty buffer (zero-filled)
const buf3 = Buffer.alloc(10);
console.log('Allocated:', buf3); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// Allocate without initialization (faster but contains old memory)
const buf4 = Buffer.allocUnsafe(10);
console.log('Unsafe:', buf4); // Contains random data


// <b>Buffer Properties</b>
// Access buffer length and underlying ArrayBuffer.
const buf = Buffer.from('Hello');
console.log('Length:', buf.length); // 5
console.log('Byte length:', buf.byteLength); // 5
console.log('Is Buffer:', Buffer.isBuffer(buf)); // true


// <b>Reading and Writing</b>
// Access individual bytes by index.
const readBuf = Buffer.from('ABCDE');
console.log('First byte:', readBuf[0]); // 65 (ASCII for 'A')
console.log('As char:', String.fromCharCode(readBuf[0])); // 'A'

// Modify bytes
const writeBuf = Buffer.alloc(5);
writeBuf[0] = 72;  // H
writeBuf[1] = 105; // i
console.log('Written:', writeBuf.toString()); // 'Hi'


// <b>Typed Methods for Numbers</b>
// Read and write numbers in various formats.
const numBuf = Buffer.alloc(16);

// 8-bit integers
numBuf.writeUInt8(255, 0);           // Unsigned
numBuf.writeInt8(-128, 1);           // Signed

// 16-bit integers (big-endian and little-endian)
numBuf.writeUInt16BE(1000, 2);       // Big-endian
numBuf.writeUInt16LE(1000, 4);       // Little-endian

// 32-bit integers
numBuf.writeUInt32BE(123456, 6);
numBuf.writeInt32LE(-123456, 10);

// Read them back
console.log('UInt8:', numBuf.readUInt8(0));       // 255
console.log('Int8:', numBuf.readInt8(1));         // -128
console.log('UInt16BE:', numBuf.readUInt16BE(2)); // 1000
console.log('UInt32BE:', numBuf.readUInt32BE(6)); // 123456


// <b>Float and Double</b>
// Work with floating-point numbers.
const floatBuf = Buffer.alloc(12);
floatBuf.writeFloatBE(3.14159, 0);
floatBuf.writeDoubleBE(3.141592653589793, 4);

console.log('Float:', floatBuf.readFloatBE(0));   // ~3.14159
console.log('Double:', floatBuf.readDoubleBE(4)); // 3.141592653589793


// <b>BigInt Support</b>
// Read and write 64-bit integers.
const bigBuf = Buffer.alloc(8);
bigBuf.writeBigInt64BE(9007199254740993n, 0);
console.log('BigInt:', bigBuf.readBigInt64BE(0)); // 9007199254740993n


// <b>String Encoding</b>
// Convert between buffers and strings with various encodings.
const strBuf = Buffer.from('Hello');

console.log('UTF-8:', strBuf.toString('utf8'));
console.log('Hex:', strBuf.toString('hex'));         // '48656c6c6f'
console.log('Base64:', strBuf.toString('base64'));   // 'SGVsbG8='

// Create from different encodings
const fromHex = Buffer.from('48656c6c6f', 'hex');
const fromBase64 = Buffer.from('SGVsbG8=', 'base64');
console.log('From hex:', fromHex.toString());       // 'Hello'
console.log('From base64:', fromBase64.toString()); // 'Hello'


// <b>Copying Buffers</b>
// Copy data between buffers.
const source = Buffer.from('Hello World');
const target = Buffer.alloc(5);

source.copy(target, 0, 0, 5); // Copy first 5 bytes
console.log('Copied:', target.toString()); // 'Hello'

// Clone entire buffer
const clone = Buffer.from(source);


// <b>Slicing Buffers</b>
// Create views into a buffer (shares memory!).
const original = Buffer.from('Hello World');
const slice = original.slice(0, 5);

console.log('Slice:', slice.toString()); // 'Hello'

// Modifying slice affects original!
slice[0] = 74; // 'J'
console.log('Original now:', original.toString()); // 'Jello World'

// Use subarray (same behavior, modern API)
const sub = original.subarray(6, 11);
console.log('Subarray:', sub.toString()); // 'World'


// <b>Concatenating Buffers</b>
// Join multiple buffers together.
const part1 = Buffer.from('Hello ');
const part2 = Buffer.from('World');
const combined = Buffer.concat([part1, part2]);
console.log('Combined:', combined.toString()); // 'Hello World'

// With total length (more efficient)
const efficient = Buffer.concat([part1, part2], 11);


// <b>Comparing Buffers</b>
// Compare buffer contents.
const a = Buffer.from('ABC');
const b = Buffer.from('ABC');
const c = Buffer.from('ABD');

console.log('a equals b:', a.equals(b));    // true
console.log('a equals c:', a.equals(c));    // false
console.log('a compare c:', a.compare(c));  // -1 (a < c)


// <b>Searching in Buffers</b>
// Find bytes or strings within buffers.
const searchBuf = Buffer.from('Hello World Hello');

console.log('indexOf World:', searchBuf.indexOf('World'));     // 6
console.log('lastIndexOf Hello:', searchBuf.lastIndexOf('Hello')); // 12
console.log('includes World:', searchBuf.includes('World'));   // true


// <b>Filling Buffers</b>
// Fill buffer with a value.
const fillBuf = Buffer.alloc(10);
fillBuf.fill('a');
console.log('Filled:', fillBuf.toString()); // 'aaaaaaaaaa'

fillBuf.fill('xy');
console.log('Pattern:', fillBuf.toString()); // 'xyxyxyxyxy'

fillBuf.fill(0); // Zero out
console.log('Zeroed:', fillBuf); // <Buffer 00 00 00 00 ...>


// <b>Iterating Buffers</b>
// Buffers are iterable.
const iterBuf = Buffer.from('ABC');

// for...of iterates bytes
for (const byte of iterBuf) {
  console.log('Byte:', byte, String.fromCharCode(byte));
}

// entries(), keys(), values()
console.log('Entries:', [...iterBuf.entries()]); // [[0, 65], [1, 66], [2, 67]]


// <b>Converting to/from TypedArrays</b>
// Buffers share memory with TypedArrays.
const buffer = Buffer.from([1, 2, 3, 4]);
const uint8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length);

console.log('As Uint8Array:', uint8);

// Create buffer from TypedArray
const arr = new Uint8Array([5, 6, 7, 8]);
const fromArr = Buffer.from(arr);


// <b>Practical Example: Binary Protocol</b>
// Parse a simple binary protocol message.
function parseMessage(buffer) {
  return {
    version: buffer.readUInt8(0),
    type: buffer.readUInt8(1),
    length: buffer.readUInt16BE(2),
    payload: buffer.subarray(4, 4 + buffer.readUInt16BE(2)).toString()
  };
}

function createMessage(type, payload) {
  const payloadBuf = Buffer.from(payload);
  const message = Buffer.alloc(4 + payloadBuf.length);
  
  message.writeUInt8(1, 0);                    // Version
  message.writeUInt8(type, 1);                 // Type
  message.writeUInt16BE(payloadBuf.length, 2); // Length
  payloadBuf.copy(message, 4);                 // Payload
  
  return message;
}

const msg = createMessage(1, 'Hello');
console.log('Created message:', msg);
console.log('Parsed:', parseMessage(msg));
