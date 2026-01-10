// The <b>process</b> object is a global that provides information about and control over the current Node.js process. It's available without importing.


// <b>Environment Variables</b>
// Access environment variables through process.env.
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('HOME:', process.env.HOME);
console.log('PATH:', process.env.PATH);

// Set environment variables (only affects current process)
process.env.MY_VAR = 'my value';
console.log('MY_VAR:', process.env.MY_VAR);

// Common pattern: provide defaults
const port = process.env.PORT || 3000;
const debug = process.env.DEBUG === 'true';


// <b>Command Line Arguments</b>
// process.argv is an array containing command line arguments.
console.log('Arguments:', process.argv);
// [0] = path to node executable
// [1] = path to script
// [2+] = user arguments

// Parse arguments
const args = process.argv.slice(2);
console.log('User args:', args);

// Simple flag parsing
const verbose = args.includes('--verbose') || args.includes('-v');
const nameIndex = args.indexOf('--name');
const name = nameIndex > -1 ? args[nameIndex + 1] : 'default';


// <b>Current Working Directory</b>
// Get and change the current working directory.
console.log('CWD:', process.cwd());

// Change directory
// process.chdir('/tmp');
// console.log('New CWD:', process.cwd());


// <b>Process Information</b>
// Access information about the running process.
console.log('Process ID:', process.pid);
console.log('Parent PID:', process.ppid);
console.log('Node version:', process.version);
console.log('Versions:', process.versions);
console.log('Platform:', process.platform); // 'darwin', 'linux', 'win32'
console.log('Architecture:', process.arch); // 'x64', 'arm64'
console.log('Title:', process.title);


// <b>Memory Usage</b>
// Get memory usage statistics.
const memory = process.memoryUsage();
console.log('Memory usage:');
console.log('  RSS:', Math.round(memory.rss / 1024 / 1024), 'MB');
console.log('  Heap Total:', Math.round(memory.heapTotal / 1024 / 1024), 'MB');
console.log('  Heap Used:', Math.round(memory.heapUsed / 1024 / 1024), 'MB');
console.log('  External:', Math.round(memory.external / 1024 / 1024), 'MB');


// <b>CPU Usage</b>
// Get CPU usage since process start or last call.
const startUsage = process.cpuUsage();
// ... do some work ...
const endUsage = process.cpuUsage(startUsage);
console.log('CPU time (microseconds):');
console.log('  User:', endUsage.user);
console.log('  System:', endUsage.system);


// <b>Uptime</b>
// Get process uptime in seconds.
console.log('Uptime:', process.uptime(), 'seconds');


// <b>Exit Codes</b>
// Exit the process with a status code.
// process.exit(0); // Success
// process.exit(1); // General error

// Set exit code without immediately exiting
process.exitCode = 0;

// Listen for exit event (can't do async work here)
process.on('exit', (code) => {
  console.log('Exiting with code:', code);
});


// <b>Uncaught Exceptions</b>
// Handle uncaught exceptions (use sparingly - prefer proper error handling).
process.on('uncaughtException', (err, origin) => {
  console.error('Uncaught exception:', err.message);
  console.error('Origin:', origin);
  process.exit(1);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});


// <b>Signals</b>
// Handle operating system signals.
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT (Ctrl+C)');
  // Cleanup and exit
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  // Graceful shutdown
  process.exit(0);
});

// Send signals to other processes
// process.kill(pid, 'SIGTERM');


// <b>Standard I/O Streams</b>
// process provides stdin, stdout, and stderr streams.
process.stdout.write('Hello to stdout\n');
process.stderr.write('Hello to stderr\n');

// Read from stdin
// process.stdin.on('data', (data) => {
//   console.log('Input:', data.toString());
// });


// <b>Next Tick</b>
// Schedule a callback to run before the next event loop iteration.
process.nextTick(() => {
  console.log('This runs before any I/O events');
});

console.log('This runs first');
// Output: "This runs first" then "This runs before any I/O events"


// <b>High Resolution Time</b>
// Get high-resolution time for precise measurements.
const start = process.hrtime.bigint();
// ... do something ...
const end = process.hrtime.bigint();
console.log('Duration:', Number(end - start) / 1e6, 'ms');


// <b>Report</b>
// Generate diagnostic reports.
// process.report.writeReport('./report.json');
// console.log('Report directory:', process.report.directory);


// <b>Practical Example: CLI Application</b>
// A pattern for building command-line applications.
function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {};
  const positional = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('-')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = true;
      }
    } else if (arg.startsWith('-')) {
      options[arg.slice(1)] = true;
    } else {
      positional.push(arg);
    }
  }
  
  return { options, positional };
}

// Usage
const { options, positional } = parseArgs(process.argv);
console.log('Options:', options);
console.log('Positional:', positional);

// Example: node script.js --name test -v file.txt
// Options: { name: 'test', v: true }
// Positional: ['file.txt']
