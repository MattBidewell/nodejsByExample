// <b>Watch Mode</b> automatically restarts your Node.js application when files change. It's built into Node.js - no external tools needed.


// <b>Basic Watch Mode</b>
// Run with: node --watch script.js
// Node.js will restart automatically when the file changes.
console.log('Server starting...');
console.log('Current time:', new Date().toISOString());


// <b>What Gets Watched</b>
// By default, Node.js watches:
// - The main script file
// - All imported/required modules

// Example server that demonstrates watch mode
import { createServer } from 'node:http';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  // Change this message and save - server auto-restarts
  const message = 'Hello from Watch Mode!';
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(message + '\n');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Modify this file and save to see auto-restart');
});


// <b>Watch Specific Paths</b>
// Use --watch-path to watch additional directories
// node --watch --watch-path=./src --watch-path=./config script.js


// <b>Preserving State</b>
// Watch mode restarts the entire process, so state is lost.
// Use external storage (files, databases) to preserve state across restarts.

let requestCount = 0; // This resets on every restart

// To preserve: write to file or use a database
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

function getPersistedCount() {
  try {
    if (existsSync('./count.txt')) {
      return parseInt(readFileSync('./count.txt', 'utf8')) || 0;
    }
  } catch {
    // Ignore errors
  }
  return 0;
}

function saveCount(count) {
  writeFileSync('./count.txt', String(count));
}


// <b>Watch Mode vs nodemon</b>
// Built-in watch mode advantages:
// - No dependencies needed
// - Faster startup
// - Works with latest Node.js features
//
// nodemon advantages:
// - More configuration options
// - Can run non-Node.js scripts
// - Supports ignore patterns


// <b>Development Workflow</b>
// Typical development setup in package.json:
// {
//   "scripts": {
//     "start": "node server.js",
//     "dev": "node --watch server.js",
//     "dev:debug": "node --watch --inspect server.js"
//   }
// }


// <b>Combining with Other Flags</b>
// Watch mode works with other Node.js flags
// node --watch --inspect server.js          # With debugger
// node --watch --env-file=.env server.js    # With env file
// node --watch --experimental-strip-types server.ts  # With TypeScript


// <b>Watch Events</b>
// The process receives events when files change
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});


// <b>Tips for Watch Mode</b>
// 1. Keep startup time fast - watch mode restarts frequently
// 2. Use environment variables for configuration
// 3. Handle SIGTERM for graceful shutdown
// 4. Use --watch-path for monorepos with multiple packages


// <b>Debugging with Watch Mode</b>
// Combine --watch with --inspect for debugging
// node --watch --inspect server.js
// Then attach your debugger (VS Code, Chrome DevTools)

if (process.env.NODE_INSPECT) {
  console.log('Debugger attached');
  debugger; // Breakpoint here when debugging
}
