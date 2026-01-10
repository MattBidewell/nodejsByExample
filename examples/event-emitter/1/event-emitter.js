// The <b>EventEmitter</b> class is the foundation of Node.js's event-driven architecture. Many built-in modules inherit from it. You can also use it in your own code.


// Import EventEmitter from the events module
import { EventEmitter } from 'node:events';


// <b>Creating an EventEmitter</b>
// Create a new instance to emit and listen for events.
const emitter = new EventEmitter();


// <b>Listening for Events</b>
// Use on() or addListener() to register event handlers.
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Trigger the event
emitter.emit('greet', 'World');
// Output: Hello, World!


// <b>Multiple Listeners</b>
// Events can have multiple listeners. They execute in order.
emitter.on('message', () => console.log('Listener 1'));
emitter.on('message', () => console.log('Listener 2'));
emitter.on('message', () => console.log('Listener 3'));

emitter.emit('message');
// Output: Listener 1, Listener 2, Listener 3


// <b>One-Time Listeners</b>
// Use once() to handle an event only the first time.
emitter.once('startup', () => {
  console.log('This only runs once');
});

emitter.emit('startup'); // Runs
emitter.emit('startup'); // Does nothing


// <b>Passing Arguments</b>
// Emit events with multiple arguments.
emitter.on('data', (type, payload, timestamp) => {
  console.log(`[${timestamp}] ${type}:`, payload);
});

emitter.emit('data', 'user', { name: 'Alice' }, Date.now());


// <b>Removing Listeners</b>
// Remove specific listeners with off() or removeListener().
function myHandler(data) {
  console.log('Handled:', data);
}

emitter.on('custom', myHandler);
emitter.emit('custom', 'test'); // Runs

emitter.off('custom', myHandler);
emitter.emit('custom', 'test'); // Does nothing


// <b>Removing All Listeners</b>
// Remove all listeners for an event or all events.
emitter.removeAllListeners('message'); // Remove all 'message' listeners
// emitter.removeAllListeners(); // Remove ALL listeners (use carefully)


// <b>Listener Count</b>
// Check how many listeners are registered.
emitter.on('count', () => {});
emitter.on('count', () => {});
console.log('Listener count:', emitter.listenerCount('count')); // 2


// <b>Getting Listeners</b>
// Retrieve registered listener functions.
const listeners = emitter.listeners('count');
console.log('Listeners:', listeners.length); // 2


// <b>Prepending Listeners</b>
// Add listeners to the beginning of the array.
emitter.on('ordered', () => console.log('Added second'));
emitter.prependListener('ordered', () => console.log('Added first, runs first'));

emitter.emit('ordered');
// Output: Added first, runs first | Added second


// <b>Error Events</b>
// Always handle 'error' events. Unhandled error events crash the process.
emitter.on('error', (err) => {
  console.error('Error occurred:', err.message);
});

emitter.emit('error', new Error('Something went wrong'));


// <b>Max Listeners Warning</b>
// By default, Node.js warns if you add more than 10 listeners (possible memory leak).
emitter.setMaxListeners(20); // Increase limit
console.log('Max listeners:', emitter.getMaxListeners()); // 20


// <b>Event Names</b>
// Get all registered event names.
console.log('Event names:', emitter.eventNames());


// <b>Extending EventEmitter</b>
// Create custom classes that emit events.
class Server extends EventEmitter {
  constructor(port) {
    super();
    this.port = port;
  }
  
  start() {
    // Simulate async startup
    setTimeout(() => {
      this.emit('start', this.port);
    }, 100);
  }
  
  handleRequest(data) {
    this.emit('request', data);
    // Process and respond
    this.emit('response', { status: 200 });
  }
}

const server = new Server(3000);

server.on('start', (port) => {
  console.log(`Server started on port ${port}`);
});

server.on('request', (data) => {
  console.log('Request received:', data);
});

server.start();
server.handleRequest({ path: '/api/users' });


// <b>Async Event Handling</b>
// Listeners can be async, but emit() doesn't wait for them.
emitter.on('async', async () => {
  await new Promise(r => setTimeout(r, 100));
  console.log('Async handler done');
});

console.log('Before emit');
emitter.emit('async');
console.log('After emit'); // Runs before async handler finishes


// <b>Promisified Events</b>
// Wait for events using promises.
import { once } from 'node:events';

async function waitForEvent() {
  const eventEmitter = new EventEmitter();
  
  // Schedule event in future
  setTimeout(() => {
    eventEmitter.emit('ready', { status: 'ok' });
  }, 100);
  
  // Wait for the event
  const [result] = await once(eventEmitter, 'ready');
  console.log('Event received:', result);
}

waitForEvent();


// <b>Practical Example: Job Queue</b>
// An event-based job queue.
class JobQueue extends EventEmitter {
  constructor() {
    super();
    this.jobs = [];
    this.processing = false;
  }
  
  add(job) {
    this.jobs.push(job);
    this.emit('job:added', job);
    this.process();
  }
  
  async process() {
    if (this.processing || this.jobs.length === 0) return;
    
    this.processing = true;
    
    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      this.emit('job:start', job);
      
      try {
        const result = await job.execute();
        this.emit('job:complete', job, result);
      } catch (err) {
        this.emit('job:error', job, err);
      }
    }
    
    this.processing = false;
    this.emit('queue:empty');
  }
}

const queue = new JobQueue();

queue.on('job:start', (job) => console.log('Starting:', job.name));
queue.on('job:complete', (job, result) => console.log('Completed:', job.name, result));
queue.on('queue:empty', () => console.log('All jobs processed'));

queue.add({ 
  name: 'Task 1', 
  execute: () => Promise.resolve('done') 
});
