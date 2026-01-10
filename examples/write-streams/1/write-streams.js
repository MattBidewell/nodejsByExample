// <b>Write Streams</b> allow you to write data to a destination piece by piece, rather than writing everything at once. This is essential for handling large amounts of data efficiently.


// Import the required modules for working with write streams.
import { createWriteStream } from 'node:fs';
import { Writable } from 'node:stream';


// <b>Creating a Write Stream</b>
// createWriteStream opens a file for writing and returns a writable stream.
const fileStream = createWriteStream('./output.txt', {
  encoding: 'utf8',
  flags: 'w' // 'w' for write (overwrite), 'a' for append
});


// <b>Writing Data</b>
// The write() method writes data to the stream. It returns true if the internal buffer is below the highWaterMark, false if you should wait.
fileStream.write('Hello, ');
fileStream.write('World!\n');
fileStream.write('This is written to a file.\n');


// <b>Ending the Stream</b>
// The end() method signals that no more data will be written. You can optionally write final data.
fileStream.end('Final line of the file.\n');


// <b>Stream Events</b>
// Write streams emit events you should handle: 'finish', 'error', 'drain', 'close'.
const logStream = createWriteStream('./log.txt');

logStream.on('finish', () => {
  console.log('All data has been flushed to the file');
});

logStream.on('error', (err) => {
  console.error('Write error:', err.message);
});

logStream.on('close', () => {
  console.log('Stream closed');
});

logStream.write('Log entry 1\n');
logStream.write('Log entry 2\n');
logStream.end();


// <b>Handling Backpressure</b>
// When write() returns false, the internal buffer is full. Wait for 'drain' before writing more.
async function writeWithBackpressure() {
  const stream = createWriteStream('./large-output.txt');
  
  for (let i = 0; i < 1000000; i++) {
    const data = `Line ${i}: Some data to write to the file\n`;
    
    // write() returns false when buffer is full
    const canContinue = stream.write(data);
    
    if (!canContinue) {
      // Wait for drain event before continuing
      await new Promise(resolve => stream.once('drain', resolve));
    }
  }
  
  stream.end();
  console.log('Large file written with backpressure handling');
}


// <b>Writing Different Data Types</b>
// You can write strings, Buffers, or Uint8Arrays.
const binaryStream = createWriteStream('./binary.dat');

// Write a string
binaryStream.write('Text data\n');

// Write a Buffer
const buffer = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
binaryStream.write(buffer);

// Write with callback
binaryStream.write('\nMore data', 'utf8', () => {
  console.log('Chunk written');
});

binaryStream.end();


// <b>Stream Options</b>
// createWriteStream accepts several useful options.
const optionsStream = createWriteStream('./configured.txt', {
  flags: 'a',           // Append mode
  encoding: 'utf8',     // Character encoding
  mode: 0o666,          // File permissions
  autoClose: true,      // Close file descriptor on finish/error
  highWaterMark: 16384  // Buffer size (16KB default)
});


// <b>Creating Custom Writable Streams</b>
// You can create custom writable streams by extending Writable or using the constructor.
const uppercaseStream = new Writable({
  write(chunk, encoding, callback) {
    // Transform and output the data
    const upper = chunk.toString().toUpperCase();
    process.stdout.write(upper);
    callback(); // Signal completion
  }
});

uppercaseStream.write('hello ');
uppercaseStream.write('world\n');
uppercaseStream.end();


// <b>Writing to Standard Output</b>
// process.stdout is a writable stream. You can write to it directly.
process.stdout.write('Direct write to stdout\n');

// Check if stdout supports colors (TTY)
if (process.stdout.isTTY) {
  process.stdout.write('\x1b[32mGreen text\x1b[0m\n');
}


// <b>Practical Example: CSV Writer</b>
// A function that writes data rows to a CSV file efficiently.
async function writeCSV(filename, headers, rows) {
  const stream = createWriteStream(filename);
  
  // Write headers
  stream.write(headers.join(',') + '\n');
  
  // Write each row
  for (const row of rows) {
    const line = row.map(cell => `"${cell}"`).join(',') + '\n';
    
    if (!stream.write(line)) {
      await new Promise(resolve => stream.once('drain', resolve));
    }
  }
  
  // Return a promise that resolves when writing is complete
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
    stream.end();
  });
}

// Usage example
const headers = ['Name', 'Age', 'City'];
const data = [
  ['Alice', '30', 'New York'],
  ['Bob', '25', 'Los Angeles'],
  ['Charlie', '35', 'Chicago']
];

writeCSV('./people.csv', headers, data)
  .then(() => console.log('CSV written successfully'));
