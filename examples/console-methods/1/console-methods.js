// The <b>console</b> object provides many useful methods beyond log(). These help with debugging, formatting, and measuring performance.


// <b>Basic Output</b>
// Different methods for different purposes.
console.log('Regular log message');
console.info('Info message');      // Same as log
console.warn('Warning message');   // Writes to stderr
console.error('Error message');    // Writes to stderr


// <b>String Formatting</b>
// Use format specifiers like printf.
console.log('Hello, %s!', 'World');           // %s = string
console.log('Count: %d', 42);                 // %d = number
console.log('Pi: %f', 3.14159);               // %f = float
console.log('Object: %o', { a: 1, b: 2 });    // %o = object
console.log('JSON: %j', { name: 'test' });    // %j = JSON
console.log('100%% complete');                 // %% = literal %


// <b>console.table() - Display Tabular Data</b>
// Renders arrays and objects as formatted tables.
const users = [
  { name: 'Alice', age: 30, role: 'Admin' },
  { name: 'Bob', age: 25, role: 'User' },
  { name: 'Charlie', age: 35, role: 'User' }
];

console.table(users);
// Outputs:
// ┌─────────┬───────────┬─────┬─────────┐
// │ (index) │   name    │ age │  role   │
// ├─────────┼───────────┼─────┼─────────┤
// │    0    │  'Alice'  │ 30  │ 'Admin' │
// │    1    │   'Bob'   │ 25  │  'User' │
// │    2    │ 'Charlie' │ 35  │  'User' │
// └─────────┴───────────┴─────┴─────────┘

// Display only specific columns
console.table(users, ['name', 'role']);


// <b>console.dir() - Object Inspection</b>
// Displays object properties with configurable depth.
const nested = {
  level1: {
    level2: {
      level3: {
        value: 'deep'
      }
    }
  }
};

console.dir(nested, { depth: null }); // Show all levels
console.dir(nested, { depth: 1 });    // Limit depth
console.dir(nested, { colors: true }); // Force colors


// <b>console.time() - Performance Timing</b>
// Measure how long operations take.
console.time('array-operation');

const arr = [];
for (let i = 0; i < 100000; i++) {
  arr.push(i);
}

console.timeEnd('array-operation');
// Output: array-operation: 5.123ms


// <b>console.timeLog() - Intermediate Timing</b>
// Log elapsed time without stopping the timer.
console.time('multi-step');

for (let i = 0; i < 50000; i++) { /* work */ }
console.timeLog('multi-step', 'Step 1 complete');

for (let i = 0; i < 50000; i++) { /* more work */ }
console.timeLog('multi-step', 'Step 2 complete');

console.timeEnd('multi-step');


// <b>console.count() - Counting Calls</b>
// Count how many times something happens.
function processItem(type) {
  console.count(type);
}

processItem('success');
processItem('success');
processItem('error');
processItem('success');
// Output:
// success: 1
// success: 2
// error: 1
// success: 3

// Reset the counter
console.countReset('success');


// <b>console.group() - Grouped Output</b>
// Group related log messages together.
console.group('User Details');
console.log('Name: Alice');
console.log('Email: alice@example.com');

console.group('Preferences');
console.log('Theme: dark');
console.log('Language: en');
console.groupEnd();

console.groupEnd();

// console.groupCollapsed() starts collapsed (in supported environments)


// <b>console.trace() - Stack Traces</b>
// Print a stack trace from the current location.
function outer() {
  inner();
}

function inner() {
  console.trace('Trace from inner');
}

outer();
// Output shows the call stack


// <b>console.assert() - Conditional Output</b>
// Only logs if the assertion is false.
console.assert(true, 'This will not print');
console.assert(false, 'This WILL print: assertion failed');

const value = 5;
console.assert(value > 10, 'Value should be > 10, got:', value);


// <b>console.clear() - Clear Console</b>
// Clears the console (in supported terminals).
// console.clear();


// <b>Custom Console</b>
// Create a console that writes to different streams.
import { Console } from 'node:console';
import { createWriteStream } from 'node:fs';

const output = createWriteStream('./app.log');
const errorOutput = createWriteStream('./error.log');

const logger = new Console({ stdout: output, stderr: errorOutput });

logger.log('This goes to app.log');
logger.error('This goes to error.log');


// <b>Colorful Output</b>
// Use ANSI codes or util.styleText for colors.
import { styleText } from 'node:util';

console.log(styleText('green', 'Success!'));
console.log(styleText('red', 'Error!'));
console.log(styleText('yellow', 'Warning!'));
console.log(styleText('bold', 'Bold text'));

// Combine styles
console.log(styleText(['bold', 'red'], 'Bold red text'));

// Manual ANSI codes
console.log('\x1b[32m%s\x1b[0m', 'Green text');
console.log('\x1b[31m%s\x1b[0m', 'Red text');
console.log('\x1b[1m%s\x1b[0m', 'Bold text');


// <b>Practical Example: Debug Logger</b>
// A simple logger with levels and timing.
class Logger {
  constructor(name) {
    this.name = name;
    this.startTime = Date.now();
  }
  
  #format(level, ...args) {
    const elapsed = Date.now() - this.startTime;
    const prefix = `[${this.name}] [${level}] +${elapsed}ms:`;
    return [prefix, ...args];
  }
  
  debug(...args) {
    if (process.env.DEBUG) {
      console.log(...this.#format('DEBUG', ...args));
    }
  }
  
  info(...args) {
    console.info(...this.#format('INFO', ...args));
  }
  
  warn(...args) {
    console.warn(...this.#format('WARN', ...args));
  }
  
  error(...args) {
    console.error(...this.#format('ERROR', ...args));
  }
  
  table(data) {
    console.group(this.name);
    console.table(data);
    console.groupEnd();
  }
}

const log = new Logger('app');
log.info('Application started');
log.debug('Debug info (only with DEBUG=1)');
log.warn('Something might be wrong');
log.error('Something went wrong');
