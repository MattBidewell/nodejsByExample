// The <b>Child Process</b> module lets you spawn new processes, execute commands, and communicate with them. It's essential for running system commands and parallel processing.


// Import the child process functions
import { spawn, exec, execFile, fork } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);


// <b>exec() - Run Shell Commands</b>
// exec() runs a command in a shell and buffers the output. Best for simple commands with small output.
exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
  }
  console.log('Output:', stdout);
});


// <b>exec() with Promises</b>
// Use the promisified version for async/await.
async function runCommand() {
  try {
    const { stdout, stderr } = await execAsync('echo "Hello World"');
    console.log('Result:', stdout.trim());
  } catch (error) {
    console.error('Failed:', error.message);
  }
}

runCommand();


// <b>spawn() - Stream Output</b>
// spawn() launches a process and provides streams for I/O. Best for long-running processes or large output.
const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});


// <b>spawn() with Options</b>
// Configure the spawned process with options.
const child = spawn('node', ['--version'], {
  cwd: '/tmp',              // Working directory
  env: { ...process.env, MY_VAR: 'value' }, // Environment
  shell: false,             // Run in shell (default: false)
  stdio: 'pipe',           // Configure stdio: 'pipe', 'inherit', 'ignore'
  timeout: 5000,           // Kill after timeout (ms)
  uid: undefined,          // User ID to run as
  gid: undefined           // Group ID to run as
});


// <b>Inheriting stdio</b>
// Pass 'inherit' to connect child's stdio to parent's.
const inherited = spawn('ls', ['-la'], {
  stdio: 'inherit' // Output goes directly to terminal
});


// <b>execFile() - Run Executables</b>
// execFile() runs an executable directly without a shell. More secure for untrusted input.
execFile('node', ['--version'], (error, stdout) => {
  if (error) throw error;
  console.log('Node version:', stdout.trim());
});


// <b>fork() - Spawn Node.js Processes</b>
// fork() is specialized for spawning Node.js processes with built-in IPC channel.

// In parent process:
// const child = fork('./worker.js');

// Send message to child
// child.send({ type: 'task', data: [1, 2, 3] });

// Receive messages from child
// child.on('message', (message) => {
//   console.log('From child:', message);
// });


// <b>Inter-Process Communication (IPC)</b>
// Communicate between parent and child processes.
function createWorker() {
  const worker = fork('./worker.js');
  
  worker.on('message', (msg) => {
    if (msg.type === 'result') {
      console.log('Worker result:', msg.data);
    }
  });
  
  worker.send({ type: 'start', data: { task: 'process' } });
  
  // Handle worker exit
  worker.on('exit', (code) => {
    console.log(`Worker exited with code ${code}`);
  });
  
  return worker;
}


// <b>Killing Processes</b>
// Terminate child processes when needed.
function killableProcess() {
  const child = spawn('sleep', ['100']);
  
  // Kill after 1 second
  setTimeout(() => {
    child.kill('SIGTERM'); // or 'SIGKILL' for force kill
    console.log('Process killed');
  }, 1000);
  
  child.on('exit', (code, signal) => {
    console.log(`Exited with code ${code}, signal ${signal}`);
  });
}


// <b>Handling Errors</b>
// Handle spawn errors (command not found, permission denied, etc.).
const badCommand = spawn('nonexistent-command');

badCommand.on('error', (err) => {
  console.error('Failed to start:', err.message);
});


// <b>Detached Processes</b>
// Create processes that can outlive the parent.
function detachedProcess() {
  const child = spawn('node', ['server.js'], {
    detached: true,
    stdio: 'ignore'
  });
  
  // Allow parent to exit independently
  child.unref();
  
  console.log('Started detached process:', child.pid);
}


// <b>Piping Between Processes</b>
// Connect multiple processes together.
function pipeProcesses() {
  const ps = spawn('ps', ['aux']);
  const grep = spawn('grep', ['node']);
  
  // Pipe ps output to grep input
  ps.stdout.pipe(grep.stdin);
  
  grep.stdout.on('data', (data) => {
    console.log('Node processes:', data.toString());
  });
}


// <b>Writing to stdin</b>
// Send input to a child process.
function writeToChild() {
  const child = spawn('cat');
  
  child.stdout.on('data', (data) => {
    console.log('Output:', data.toString());
  });
  
  child.stdin.write('Hello\n');
  child.stdin.write('World\n');
  child.stdin.end();
}


// <b>Practical Example: Command Runner</b>
// A utility for running commands with timeout and output capture.
async function runWithTimeout(command, args = [], options = {}) {
  const { timeout = 30000, cwd } = options;
  
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd });
    const stdout = [];
    const stderr = [];
    
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`Command timed out after ${timeout}ms`));
    }, timeout);
    
    child.stdout.on('data', (data) => stdout.push(data));
    child.stderr.on('data', (data) => stderr.push(data));
    
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        code,
        stdout: Buffer.concat(stdout).toString(),
        stderr: Buffer.concat(stderr).toString()
      });
    });
  });
}

// Usage
runWithTimeout('echo', ['Hello World'], { timeout: 5000 })
  .then(result => console.log('Result:', result))
  .catch(err => console.error('Error:', err));


// <b>Practical Example: Parallel Task Runner</b>
// Run multiple commands in parallel with concurrency limit.
async function runParallel(commands, concurrency = 4) {
  const results = [];
  const executing = new Set();
  
  for (const cmd of commands) {
    const promise = execAsync(cmd).then(result => {
      executing.delete(promise);
      return { cmd, ...result };
    });
    
    executing.add(promise);
    results.push(promise);
    
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// Usage
// runParallel(['echo 1', 'echo 2', 'echo 3'], 2).then(console.log);
