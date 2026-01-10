// <b>Read Streams</b> allow you to efficiently read data from a source piece by piece, rather than loading everything into memory at once. This is essential for handling large files or continuous data sources.


// First, let's import the required modules. The fs module provides the createReadStream function, and we'll use Readable for creating custom streams.
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';


// <b>Creating a Read Stream from a File</b>
// The simplest use case is reading a file. By default, streams emit Buffer chunks. We can specify an encoding to get strings instead.
const fileStream = createReadStream('./example.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024 // 64KB chunks (default is 64KB)
});


// <b>Handling Stream Events</b>
// Readable streams emit several important events:
// <br>- <b>data</b>: emitted when a chunk of data is available
// <br>- <b>end</b>: emitted when there is no more data to read
// <br>- <b>error</b>: emitted if an error occurs
// <br>- <b>close</b>: emitted when the stream and its resources are closed
fileStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
  console.log(chunk);
});

fileStream.on('end', () => {
  console.log('Finished reading file');
});

fileStream.on('error', (err) => {
  console.error('Error reading file:', err.message);
});


// <b>Pausing and Resuming</b>
// Streams can be paused and resumed. This is useful when you need to slow down data consumption, for example when writing to a slower destination.
const controlledStream = createReadStream('./large-file.txt', {
  encoding: 'utf8'
});

controlledStream.on('data', (chunk) => {
  console.log('Processing chunk...');
  
  // Pause the stream to control flow
  controlledStream.pause();
  
  // Simulate slow async processing
  setTimeout(() => {
    console.log('Chunk processed, resuming...');
    controlledStream.resume();
  }, 100);
});


// <b>Using Async Iteration</b>
// Modern Node.js supports async iteration on streams, providing a cleaner syntax using for-await-of loops. This is often the preferred approach.
async function readFileAsync() {
  const stream = createReadStream('./example.txt', { encoding: 'utf8' });
  
  for await (const chunk of stream) {
    console.log('Chunk:', chunk);
  }
  
  console.log('Done reading');
}

readFileAsync();


// <b>Creating Readable Streams from Iterables</b>
// You can create readable streams from arrays, generators, or any iterable using Readable.from(). This is useful for testing or creating data pipelines.
const customStream = Readable.from(['Hello', ' ', 'World', '!']);

customStream.on('data', (chunk) => {
  process.stdout.write(chunk.toString());
});

customStream.on('end', () => {
  console.log('\nCustom stream ended');
});


// <b>Reading in Paused Mode</b>
// Streams operate in two modes: flowing and paused. In paused mode, you must explicitly call read() to get chunks of data.
const pausedStream = createReadStream('./example.txt');

pausedStream.on('readable', () => {
  let chunk;
  // Read 10 bytes at a time
  while ((chunk = pausedStream.read(10)) !== null) {
    console.log(`Read ${chunk.length} bytes:`, chunk.toString());
  }
});


// <b>Stream Options</b>
// createReadStream accepts several useful options:
// <br>- <b>encoding</b>: Character encoding (utf8, ascii, etc.)
// <br>- <b>highWaterMark</b>: Maximum bytes to store in buffer
// <br>- <b>start</b>: Byte position to start reading from
// <br>- <b>end</b>: Byte position to stop reading at
const partialStream = createReadStream('./example.txt', {
  encoding: 'utf8',
  start: 0,
  end: 50 // Read only first 50 bytes
});

partialStream.on('data', (chunk) => {
  console.log('Partial read:', chunk);
});
