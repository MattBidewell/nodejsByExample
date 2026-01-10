// <b>Worker Threads</b> enable running JavaScript in parallel threads. Unlike child processes, workers share memory and have lower overhead. Use them for CPU-intensive tasks.


// Import worker thread utilities
import { Worker, isMainThread, parentPort, workerData, threadId } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';


// <b>Main Thread vs Worker Thread</b>
// The same file can act as both main thread and worker. Use isMainThread to differentiate.
if (isMainThread) {
  console.log('Running in main thread');
  console.log('Thread ID:', threadId); // Always 0 for main thread
} else {
  console.log('Running in worker thread');
  console.log('Thread ID:', threadId);
}


// <b>Creating a Worker</b>
// Create a worker from the same file or a separate file.
if (isMainThread) {
  const __filename = fileURLToPath(import.meta.url);
  
  const worker = new Worker(__filename, {
    workerData: { task: 'calculate', value: 42 }
  });
  
  worker.on('message', (result) => {
    console.log('Result from worker:', result);
  });
  
  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });
  
  worker.on('exit', (code) => {
    console.log('Worker exited with code:', code);
  });
} else {
  // Worker thread code
  console.log('Worker received:', workerData);
  parentPort.postMessage({ result: workerData.value * 2 });
}


// <b>Sending Messages</b>
// Communicate between main and worker threads using postMessage.
function createMessagingWorker() {
  if (!isMainThread) return;
  
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { mode: 'messaging' }
  });
  
  // Send message to worker
  worker.postMessage({ type: 'task', data: [1, 2, 3, 4, 5] });
  
  // Receive messages from worker
  worker.on('message', (msg) => {
    if (msg.type === 'progress') {
      console.log('Progress:', msg.percent + '%');
    } else if (msg.type === 'complete') {
      console.log('Result:', msg.result);
      worker.terminate();
    }
  });
}


// <b>Worker Code for Messaging</b>
if (!isMainThread && workerData?.mode === 'messaging') {
  parentPort.on('message', (msg) => {
    if (msg.type === 'task') {
      const data = msg.data;
      
      // Report progress
      for (let i = 0; i < data.length; i++) {
        parentPort.postMessage({ type: 'progress', percent: ((i + 1) / data.length) * 100 });
      }
      
      // Send result
      const sum = data.reduce((a, b) => a + b, 0);
      parentPort.postMessage({ type: 'complete', result: sum });
    }
  });
}


// <b>Sharing Memory with SharedArrayBuffer</b>
// Share memory between threads for high-performance scenarios.
function sharedMemoryExample() {
  if (!isMainThread) return;
  
  // Create shared buffer (4 bytes for one Int32)
  const sharedBuffer = new SharedArrayBuffer(4);
  const sharedArray = new Int32Array(sharedBuffer);
  
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { mode: 'shared', sharedBuffer }
  });
  
  // Main thread can read/write
  sharedArray[0] = 0;
  
  setInterval(() => {
    console.log('Main sees:', sharedArray[0]);
  }, 100);
}


// <b>Worker Code for Shared Memory</b>
if (!isMainThread && workerData?.mode === 'shared') {
  const sharedArray = new Int32Array(workerData.sharedBuffer);
  
  // Worker increments the shared value
  setInterval(() => {
    sharedArray[0]++;
  }, 50);
}


// <b>Atomics for Thread-Safe Operations</b>
// Use Atomics for thread-safe operations on shared memory.
function atomicsExample() {
  if (!isMainThread) return;
  
  const sharedBuffer = new SharedArrayBuffer(4);
  const sharedArray = new Int32Array(sharedBuffer);
  
  // Atomic operations
  Atomics.store(sharedArray, 0, 100);     // Set value atomically
  const value = Atomics.load(sharedArray, 0); // Read atomically
  Atomics.add(sharedArray, 0, 5);         // Add atomically
  Atomics.sub(sharedArray, 0, 3);         // Subtract atomically
  
  // Compare and exchange
  Atomics.compareExchange(sharedArray, 0, 102, 200); // If 102, set to 200
  
  // Wait and notify (for synchronization)
  // Atomics.wait(sharedArray, 0, expectedValue);
  // Atomics.notify(sharedArray, 0, count);
}


// <b>Transferring Data</b>
// Transfer ownership of ArrayBuffers to workers (zero-copy).
function transferExample() {
  if (!isMainThread) return;
  
  const buffer = new ArrayBuffer(1024 * 1024); // 1MB
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { mode: 'transfer' }
  });
  
  // Transfer buffer (main thread loses access)
  worker.postMessage({ buffer }, [buffer]);
  
  console.log('Buffer size after transfer:', buffer.byteLength); // 0
}


// <b>Worker Pool</b>
// Reuse workers for better performance.
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workers = [];
    this.queue = [];
    this.poolSize = poolSize;
    this.workerScript = workerScript;
  }
  
  async runTask(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      
      const worker = this.getAvailableWorker();
      if (worker) {
        this.runOnWorker(worker, task);
      } else {
        this.queue.push(task);
      }
    });
  }
  
  getAvailableWorker() {
    if (this.workers.length < this.poolSize) {
      const worker = new Worker(this.workerScript);
      worker.busy = false;
      this.workers.push(worker);
      return worker;
    }
    return this.workers.find(w => !w.busy);
  }
  
  runOnWorker(worker, task) {
    worker.busy = true;
    
    const handler = (result) => {
      worker.busy = false;
      worker.removeListener('message', handler);
      task.resolve(result);
      
      const nextTask = this.queue.shift();
      if (nextTask) {
        this.runOnWorker(worker, nextTask);
      }
    };
    
    worker.on('message', handler);
    worker.postMessage(task.data);
  }
  
  terminate() {
    this.workers.forEach(w => w.terminate());
  }
}


// <b>Practical Example: CPU-Intensive Task</b>
// Offload heavy computation to a worker.
function calculatePrimes(max) {
  const sieve = new Array(max + 1).fill(true);
  sieve[0] = sieve[1] = false;
  
  for (let i = 2; i * i <= max; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= max; j += i) {
        sieve[j] = false;
      }
    }
  }
  
  return sieve.reduce((count, isPrime) => count + (isPrime ? 1 : 0), 0);
}

// Worker code for prime calculation
if (!isMainThread && workerData?.mode === 'primes') {
  const count = calculatePrimes(workerData.max);
  parentPort.postMessage({ count });
}

// Main thread usage
async function countPrimesWithWorker(max) {
  return new Promise((resolve) => {
    const worker = new Worker(new URL(import.meta.url), {
      workerData: { mode: 'primes', max }
    });
    
    worker.on('message', (msg) => {
      resolve(msg.count);
      worker.terminate();
    });
  });
}

// Run example
if (isMainThread) {
  countPrimesWithWorker(1000000).then(count => {
    console.log('Primes up to 1M:', count);
  });
}
