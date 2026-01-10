// <b>Pipelines</b> connect streams together, automatically handling backpressure and cleanup. The pipeline() function is the recommended way to pipe streams in Node.js.


// Import pipeline and stream utilities
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip, createGunzip } from 'node:zlib';
import { Transform } from 'node:stream';


// <b>Basic Pipeline</b>
// pipeline() connects a source stream through optional transforms to a destination. It returns a promise.
async function basicPipeline() {
  await pipeline(
    createReadStream('./input.txt'),
    createWriteStream('./output.txt')
  );
  console.log('File copied successfully');
}


// <b>Pipeline with Compression</b>
// You can include transform streams in the pipeline, like gzip compression.
async function compressFile() {
  await pipeline(
    createReadStream('./data.txt'),
    createGzip(),
    createWriteStream('./data.txt.gz')
  );
  console.log('File compressed');
}

async function decompressFile() {
  await pipeline(
    createReadStream('./data.txt.gz'),
    createGunzip(),
    createWriteStream('./data-restored.txt')
  );
  console.log('File decompressed');
}


// <b>Custom Transform Streams</b>
// Transform streams process data as it flows through the pipeline.
const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

async function transformPipeline() {
  await pipeline(
    createReadStream('./input.txt'),
    uppercase,
    createWriteStream('./uppercase.txt')
  );
  console.log('File transformed to uppercase');
}


// <b>Multiple Transforms</b>
// Chain multiple transforms together for complex processing.
const addLineNumbers = new Transform({
  transform(chunk, encoding, callback) {
    this.lineNumber = (this.lineNumber || 0);
    const lines = chunk.toString().split('\n');
    const numbered = lines
      .map(line => line ? `${++this.lineNumber}: ${line}` : '')
      .join('\n');
    this.push(numbered);
    callback();
  }
});

const addTimestamp = new Transform({
  transform(chunk, encoding, callback) {
    const timestamp = new Date().toISOString();
    this.push(`[${timestamp}]\n${chunk}`);
    callback();
  }
});

async function multiTransformPipeline() {
  await pipeline(
    createReadStream('./log.txt'),
    addLineNumbers,
    addTimestamp,
    createWriteStream('./processed-log.txt')
  );
}


// <b>Async Generator in Pipeline</b>
// You can use async generators as sources or transforms in pipelines.
async function* generateLines() {
  for (let i = 1; i <= 100; i++) {
    yield `Line ${i}\n`;
  }
}

async function generatorPipeline() {
  await pipeline(
    generateLines,
    createWriteStream('./generated.txt')
  );
  console.log('Generated file from async iterator');
}


// <b>Async Transform with Generator</b>
// Transform data using an async generator function.
async function* doubleNumbers(source) {
  for await (const chunk of source) {
    const numbers = chunk.toString().trim().split('\n');
    for (const num of numbers) {
      const doubled = parseInt(num) * 2;
      yield `${doubled}\n`;
    }
  }
}

async function asyncTransformPipeline() {
  await pipeline(
    createReadStream('./numbers.txt'),
    doubleNumbers,
    createWriteStream('./doubled.txt')
  );
}


// <b>Error Handling</b>
// pipeline() automatically handles errors and cleans up all streams.
async function errorHandlingPipeline() {
  try {
    await pipeline(
      createReadStream('./nonexistent.txt'),
      createWriteStream('./output.txt')
    );
  } catch (err) {
    console.error('Pipeline failed:', err.message);
    // All streams are automatically destroyed
  }
}


// <b>AbortController for Cancellation</b>
// Use AbortController to cancel a pipeline in progress.
async function cancellablePipeline() {
  const controller = new AbortController();
  
  // Cancel after 1 second
  setTimeout(() => controller.abort(), 1000);
  
  try {
    await pipeline(
      createReadStream('./large-file.txt'),
      createWriteStream('./output.txt'),
      { signal: controller.signal }
    );
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Pipeline was cancelled');
    } else {
      throw err;
    }
  }
}


// <b>Practical Example: Log Processor</b>
// A complete example that reads logs, filters errors, and writes to a new file.
function createErrorFilter() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n');
      const errors = lines
        .filter(line => line.includes('ERROR'))
        .join('\n');
      if (errors) {
        this.push(errors + '\n');
      }
      callback();
    }
  });
}

async function processLogs() {
  await pipeline(
    createReadStream('./application.log'),
    createErrorFilter(),
    createGzip(),
    createWriteStream('./errors.log.gz')
  );
  console.log('Error logs extracted and compressed');
}


// <b>Pipeline with Standard I/O</b>
// You can use process.stdin and process.stdout in pipelines.
async function stdioTransform() {
  const reverse = new Transform({
    transform(chunk, encoding, callback) {
      const reversed = chunk.toString().split('').reverse().join('');
      this.push(reversed);
      callback();
    }
  });
  
  // This reads from stdin, reverses, and writes to stdout
  // Uncomment to use: await pipeline(process.stdin, reverse, process.stdout);
}

// Run examples
basicPipeline().catch(console.error);
generatorPipeline().catch(console.error);
