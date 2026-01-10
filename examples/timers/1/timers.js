// <b>Timers</b> in Node.js let you schedule code to run after a delay or at intervals. They're similar to browser timers but with some differences.


// <b>setTimeout - Run Once After Delay</b>
// Execute a function after a specified number of milliseconds.
const timeoutId = setTimeout(() => {
  console.log('This runs after 1 second');
}, 1000);

// With arguments
setTimeout((name, greeting) => {
  console.log(`${greeting}, ${name}!`);
}, 500, 'Alice', 'Hello');


// <b>Cancelling Timers</b>
// Cancel a timeout before it executes.
const cancelMe = setTimeout(() => {
  console.log('This will never run');
}, 2000);

clearTimeout(cancelMe);


// <b>setInterval - Run Repeatedly</b>
// Execute a function repeatedly at fixed intervals.
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`Interval tick ${count}`);
  
  // Stop after 5 ticks
  if (count >= 5) {
    clearInterval(intervalId);
    console.log('Interval stopped');
  }
}, 200);


// <b>setImmediate - Run After I/O</b>
// Execute a function after the current event loop cycle, before timers.
setImmediate(() => {
  console.log('setImmediate runs after I/O events');
});

setTimeout(() => {
  console.log('setTimeout 0 may run before or after setImmediate');
}, 0);


// <b>process.nextTick - Run Before Everything</b>
// Execute before any I/O events or timers (same event loop phase).
process.nextTick(() => {
  console.log('nextTick runs before setTimeout and setImmediate');
});

console.log('Synchronous code runs first');

// Order: Sync -> nextTick -> setTimeout/setImmediate


// <b>Event Loop Order</b>
// Understanding the execution order.
setTimeout(() => console.log('1. setTimeout'), 0);
setImmediate(() => console.log('2. setImmediate'));
process.nextTick(() => console.log('3. nextTick'));
console.log('4. sync');

// Output order: 4, 3, then 1 and 2 (order varies)


// <b>Timer Objects</b>
// Timer functions return objects with useful methods.
const timer = setTimeout(() => {}, 10000);

// Prevent timer from keeping Node.js running
timer.unref();

// Allow timer to keep Node.js running again
timer.ref();

// Refresh timer (reset the delay)
timer.refresh();


// <b>Promises-based Timers</b>
// Modern async/await compatible timers.
import { setTimeout as sleep, setInterval as interval } from 'node:timers/promises';

async function asyncTimers() {
  console.log('Starting...');
  
  // Sleep for 500ms
  await sleep(500);
  console.log('After 500ms');
  
  // Sleep with a value
  const result = await sleep(100, 'done');
  console.log('Result:', result); // 'done'
}

asyncTimers();


// <b>Async Intervals</b>
// Iterate over intervals with for-await-of.
async function asyncInterval() {
  let count = 0;
  
  for await (const _ of interval(100)) {
    count++;
    console.log(`Async interval ${count}`);
    
    if (count >= 3) break;
  }
}

asyncInterval();


// <b>AbortController with Timers</b>
// Cancel promise-based timers with AbortController.
async function cancellableTimer() {
  const controller = new AbortController();
  
  // Cancel after 50ms
  setTimeout(() => controller.abort(), 50);
  
  try {
    await sleep(1000, null, { signal: controller.signal });
    console.log('Timer completed');
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Timer was cancelled');
    }
  }
}

cancellableTimer();


// <b>Scheduling with Dates</b>
// Run code at a specific time.
function runAt(date, callback) {
  const now = Date.now();
  const target = date.getTime();
  const delay = Math.max(0, target - now);
  
  return setTimeout(callback, delay);
}

// Run 2 seconds from now
const futureDate = new Date(Date.now() + 2000);
runAt(futureDate, () => {
  console.log('Scheduled task ran at', new Date().toISOString());
});


// <b>Debouncing</b>
// Delay execution until after a pause in calls.
function debounce(fn, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedLog = debounce(console.log, 300);
debouncedLog('a');
debouncedLog('b');
debouncedLog('c'); // Only 'c' logs after 300ms


// <b>Throttling</b>
// Limit execution to at most once per interval.
function throttle(fn, limit) {
  let lastRun = 0;
  
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn.apply(this, args);
    }
  };
}

const throttledLog = throttle(console.log, 1000);
throttledLog('first');  // Logs immediately
throttledLog('second'); // Ignored (too soon)


// <b>Retry with Backoff</b>
// Retry failed operations with increasing delays.
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 100) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry ${attempt + 1} after ${delay}ms`);
      await sleep(delay);
    }
  }
}


// <b>Practical Example: Polling</b>
// Poll an API at regular intervals.
async function poll(fn, interval, shouldStop) {
  while (!shouldStop()) {
    try {
      const result = await fn();
      console.log('Poll result:', result);
    } catch (err) {
      console.error('Poll error:', err.message);
    }
    
    await sleep(interval);
  }
}

// Usage (commented out to not run forever):
// let stopped = false;
// poll(() => fetch('/api/status').then(r => r.json()), 5000, () => stopped);
// setTimeout(() => stopped = true, 30000); // Stop after 30s
