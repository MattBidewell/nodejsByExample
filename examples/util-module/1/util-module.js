// The <b>util</b> module provides essential utility functions for debugging, formatting, and working with JavaScript patterns in Node.js.


// Import commonly used utilities
import {
  promisify,
  inspect,
  format,
  formatWithOptions,
  styleText,
  parseArgs,
  types,
  deprecate,
  debuglog
} from 'node:util';


// <b>util.promisify() - Convert Callbacks to Promises</b>
// Converts callback-based functions to Promise-based ones.
import { readFile, stat } from 'node:fs';

const readFileAsync = promisify(readFile);
const statAsync = promisify(stat);

async function readConfig() {
  try {
    const content = await readFileAsync('./package.json', 'utf8');
    console.log('File length:', content.length);
  } catch (err) {
    console.error('Error reading file:', err.message);
  }
}

readConfig();


// <b>util.inspect() - Object Inspection</b>
// Converts objects to readable strings with customizable formatting.
const complexObject = {
  name: 'Example',
  nested: {
    deep: {
      value: [1, 2, 3],
      fn: () => 'hello',
      symbol: Symbol('test')
    }
  },
  hidden: Object.defineProperty({}, 'secret', {
    value: 'hidden value',
    enumerable: false
  })
};

// Basic inspection
console.log(inspect(complexObject));

// With options
console.log(inspect(complexObject, {
  depth: Infinity,      // Show all nesting levels (default: 2)
  colors: true,         // Colorize output for terminals
  showHidden: true,     // Show non-enumerable properties
  maxArrayLength: 10,   // Max array elements to show
  maxStringLength: 100, // Truncate long strings
  breakLength: 80,      // Line width for wrapping
  compact: false,       // Use multiple lines
  sorted: true          // Sort object keys
}));

// Handle circular references
const circular = { name: 'circular' };
circular.self = circular;
console.log(inspect(circular)); // Shows [Circular *1]


// <b>util.format() - String Formatting</b>
// Printf-style string formatting.
console.log(format('Hello, %s!', 'World'));           // %s = string
console.log(format('Count: %d', 42));                  // %d = number
console.log(format('Float: %f', 3.14159));             // %f = float
console.log(format('Integer: %i', 42.9));              // %i = integer (truncates)
console.log(format('Object: %o', { a: 1 }));           // %o = object
console.log(format('JSON: %j', { name: 'test' }));     // %j = JSON string
console.log(format('Percent: 100%%'));                 // %% = literal %
console.log(format('BigInt: %d', 123456789012345678901234567890n)); // BigInt support

// Extra arguments are concatenated
console.log(format('Value:', 42, 'extra', 'args'));


// <b>util.formatWithOptions() - Format with Inspect Options</b>
// Like format() but passes options to inspect().
console.log(formatWithOptions(
  { colors: true, depth: 2 },
  'Object: %o',
  { nested: { value: 123 } }
));


// <b>util.styleText() - Terminal Styling</b>
// Apply ANSI colors and styles to text.
console.log(styleText('green', 'Success!'));
console.log(styleText('red', 'Error!'));
console.log(styleText('yellow', 'Warning!'));
console.log(styleText('blue', 'Info'));
console.log(styleText('bold', 'Bold text'));
console.log(styleText('underline', 'Underlined'));
console.log(styleText('italic', 'Italic text'));

// Combine multiple styles with an array
console.log(styleText(['bold', 'red'], 'Bold and red!'));
console.log(styleText(['underline', 'green'], 'Underlined green'));

// Background colors
console.log(styleText('bgRed', 'Red background'));
console.log(styleText('bgGreen', 'Green background'));


// <b>util.parseArgs() - CLI Argument Parsing</b>
// Parse command-line arguments with options.
const args = ['--name', 'Alice', '--verbose', '-n', '5', 'file.txt'];

const { values, positionals } = parseArgs({
  args,
  options: {
    name: { type: 'string', short: 'N' },
    verbose: { type: 'boolean', short: 'v' },
    count: { type: 'string', short: 'n' }
  },
  allowPositionals: true
});

console.log('Parsed values:', values);
// { name: 'Alice', verbose: true, count: '5' }
console.log('Positional args:', positionals);
// ['file.txt']


// <b>util.parseArgs() with Defaults and Multiple Values</b>
const { values: opts } = parseArgs({
  args: ['--tag', 'v1', '--tag', 'v2', '--debug'],
  options: {
    tag: { type: 'string', multiple: true, default: [] },
    debug: { type: 'boolean', default: false },
    port: { type: 'string', default: '3000' }
  }
});

console.log('Multiple values:', opts.tag);  // ['v1', 'v2']
console.log('Default value:', opts.port);   // '3000'


// <b>util.types - Type Checking</b>
// Check for specific JavaScript and Node.js types.
console.log('isDate:', types.isDate(new Date()));           // true
console.log('isRegExp:', types.isRegExp(/pattern/));        // true
console.log('isPromise:', types.isPromise(Promise.resolve())); // true
console.log('isSet:', types.isSet(new Set()));              // true
console.log('isMap:', types.isMap(new Map()));              // true

// Check for special object types
console.log('isArrayBuffer:', types.isArrayBuffer(new ArrayBuffer(8)));
console.log('isTypedArray:', types.isTypedArray(new Uint8Array(8)));
console.log('isAsyncFunction:', types.isAsyncFunction(async () => {}));
console.log('isGeneratorFunction:', types.isGeneratorFunction(function* () {}));

// Node.js specific types
console.log('isNativeError:', types.isNativeError(new Error()));
console.log('isBoxedPrimitive:', types.isBoxedPrimitive(new String('test')));


// <b>util.deprecate() - Mark Functions Deprecated</b>
// Emit warnings when deprecated functions are called.
const oldFunction = deprecate(
  () => console.log('Old behavior'),
  'oldFunction() is deprecated. Use newFunction() instead.',
  'DEP001'
);

// First call emits warning, subsequent calls do not
// oldFunction();


// <b>util.debuglog() - Conditional Debug Output</b>
// Create debug loggers enabled by NODE_DEBUG env variable.
const debug = debuglog('myapp');
const debugDb = debuglog('myapp-db');

// Only logs if NODE_DEBUG=myapp or NODE_DEBUG=myapp-db
debug('Application starting...');
debugDb('Connecting to database...');

// Run with: NODE_DEBUG=myapp node script.js


// <b>util.callbackify() - Convert Promise to Callback</b>
// Convert async functions back to callback style.
import { callbackify } from 'node:util';

async function asyncGreet(name) {
  return `Hello, ${name}!`;
}

const greetCallback = callbackify(asyncGreet);

greetCallback('World', (err, result) => {
  if (err) throw err;
  console.log(result); // 'Hello, World!'
});


// <b>Practical Example: Enhanced Logger</b>
// Combine util functions for a feature-rich logger.
function createLogger(namespace) {
  const debug = debuglog(namespace);
  
  return {
    info(...args) {
      const message = format(...args);
      console.log(styleText('blue', `[${namespace}]`), message);
    },
    
    success(...args) {
      const message = format(...args);
      console.log(styleText('green', `[${namespace}]`), message);
    },
    
    warn(...args) {
      const message = format(...args);
      console.warn(styleText('yellow', `[${namespace}]`), message);
    },
    
    error(...args) {
      const message = format(...args);
      console.error(styleText('red', `[${namespace}]`), message);
    },
    
    debug(...args) {
      debug(format(...args));
    },
    
    inspect(obj, options = {}) {
      console.log(inspect(obj, { colors: true, depth: 3, ...options }));
    }
  };
}

const log = createLogger('app');
log.info('Server started on port %d', 3000);
log.success('Connected to %s', 'database');
log.warn('Cache miss for key: %s', 'user:123');
log.error('Failed to process request: %s', 'timeout');
log.inspect({ user: { name: 'Alice', role: 'admin' } });
