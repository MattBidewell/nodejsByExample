// <b>Debugging</b> in Node.js can be done using the built-in inspector, Chrome DevTools, or VS Code. The debugger keyword sets breakpoints in code.


// <b>The debugger Statement</b>
// When the inspector is active, execution pauses at debugger statements.
function calculateTotal(items) {
  let total = 0;
  
  for (const item of items) {
    debugger; // Execution pauses here when debugging
    total += item.price * item.quantity;
  }
  
  return total;
}

const items = [
  { name: 'Apple', price: 1.50, quantity: 3 },
  { name: 'Banana', price: 0.75, quantity: 5 },
  { name: 'Orange', price: 2.00, quantity: 2 }
];

console.log('Total:', calculateTotal(items));


// <b>Starting the Debugger</b>
// Run with --inspect to enable the debugger.
// node --inspect script.js          # Start debugger, don't pause
// node --inspect-brk script.js      # Start debugger, pause at first line

// The debugger listens on ws://127.0.0.1:9229


// <b>Using Chrome DevTools</b>
// 1. Run: node --inspect script.js
// 2. Open Chrome and go to: chrome://inspect
// 3. Click "Open dedicated DevTools for Node"
// 4. Set breakpoints, inspect variables, step through code


// <b>Inspect Utility</b>
// Use util.inspect() for detailed object inspection.
import { inspect } from 'node:util';

const complexObject = {
  name: 'Test',
  nested: {
    deep: {
      value: [1, 2, 3],
      fn: () => 'hello'
    }
  },
  circular: null
};
complexObject.circular = complexObject;

console.log(inspect(complexObject, {
  depth: Infinity,    // Show all levels
  colors: true,       // Colorize output
  showHidden: false,  // Don't show non-enumerable
  maxArrayLength: 10, // Limit array items shown
  breakLength: 80     // Line wrap width
}));


// <b>Error Stack Traces</b>
// Capture and analyze stack traces.
function level1() {
  level2();
}

function level2() {
  level3();
}

function level3() {
  const err = new Error('Something went wrong');
  console.log('Stack trace:');
  console.log(err.stack);
}

level1();


// <b>Capturing Stack Traces</b>
// Capture stack traces without throwing.
function captureStack() {
  const obj = {};
  Error.captureStackTrace(obj);
  return obj.stack;
}

console.log('Current stack:', captureStack());


// <b>Debug Module Pattern</b>
// Create conditional debug output based on environment.
function createDebugger(namespace) {
  const enabled = process.env.DEBUG?.includes(namespace) || 
                  process.env.DEBUG === '*';
  
  return function debug(...args) {
    if (enabled) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${namespace}]`, ...args);
    }
  };
}

const debugDb = createDebugger('db');
const debugHttp = createDebugger('http');
const debugApp = createDebugger('app');

debugDb('Connecting to database...');
debugHttp('GET /api/users');
debugApp('Application starting');


// <b>Performance Debugging</b>
// Use performance hooks for detailed timing.
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Observe performance measurements
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach(entry => {
    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
  });
});
obs.observe({ entryTypes: ['measure'] });

// Mark start and end points
performance.mark('start-processing');

// Simulate work
const data = Array.from({ length: 10000 }, (_, i) => i);
const sum = data.reduce((a, b) => a + b, 0);

performance.mark('end-processing');

// Measure between marks
performance.measure('processing', 'start-processing', 'end-processing');


// <b>Memory Debugging</b>
// Analyze memory usage patterns.
function analyzeMemory(label) {
  const usage = process.memoryUsage();
  console.log(`\n${label}:`);
  console.log(`  RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap Total: ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
}

analyzeMemory('Before allocation');

// Allocate memory
const bigArray = new Array(1000000).fill('x'.repeat(100));

analyzeMemory('After allocation');

// Force garbage collection (requires --expose-gc flag)
// global.gc();
// analyzeMemory('After GC');


// <b>Async Debugging</b>
// Debug async code with async_hooks or the inspector.
async function fetchData(id) {
  debugger; // Pause in async function
  
  await new Promise(r => setTimeout(r, 100));
  
  debugger; // Pause after await
  
  return { id, data: 'result' };
}

// The inspector properly handles async call stacks


// <b>Conditional Breakpoints</b>
// In DevTools, you can set conditions for breakpoints.
function processUser(user) {
  // In DevTools, right-click line number > Add conditional breakpoint
  // Condition: user.role === 'admin'
  debugger; // Or check condition in code
  
  if (user.role === 'admin') {
    console.log('Processing admin:', user.name);
  }
}


// <b>Remote Debugging</b>
// Debug a remote Node.js process.
// On remote server: node --inspect=0.0.0.0:9229 app.js
// Then SSH tunnel: ssh -L 9229:localhost:9229 remote-server
// Connect Chrome DevTools to localhost:9229


// <b>VS Code Debugging</b>
// Create .vscode/launch.json:
/*
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug",
      "program": "${workspaceFolder}/app.js",
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 9229
    }
  ]
}
*/


// <b>Practical Example: Request Tracer</b>
// Trace function calls for debugging.
function createTracer(name) {
  return {
    enter(fn, args) {
      console.log(`→ ${name}.${fn}(${JSON.stringify(args)})`);
    },
    exit(fn, result) {
      console.log(`← ${name}.${fn} = ${JSON.stringify(result)}`);
    },
    error(fn, err) {
      console.log(`✗ ${name}.${fn} threw: ${err.message}`);
    }
  };
}

function traced(obj, tracer) {
  return new Proxy(obj, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value === 'function') {
        return function(...args) {
          tracer.enter(prop, args);
          try {
            const result = value.apply(target, args);
            tracer.exit(prop, result);
            return result;
          } catch (err) {
            tracer.error(prop, err);
            throw err;
          }
        };
      }
      return value;
    }
  });
}

const calculator = {
  add(a, b) { return a + b; },
  divide(a, b) { 
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
};

const tracedCalc = traced(calculator, createTracer('Calculator'));
tracedCalc.add(2, 3);
tracedCalc.divide(10, 2);
