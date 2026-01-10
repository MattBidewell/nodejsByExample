// The <b>HTTP</b> module allows you to create web servers and make HTTP requests. It's the foundation for web applications in Node.js.


// Import the http module to create servers
import { createServer } from 'node:http';


// <b>Creating a Basic Server</b>
// createServer() takes a request handler function that receives request and response objects.
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});


// <b>Handling Different Routes</b>
// Use req.url and req.method to handle different endpoints.
const routedServer = createServer((req, res) => {
  const { url, method } = req;
  
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } 
  else if (url === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Alice' }]));
  }
  else if (url === '/api/users' && method === 'POST') {
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User created' }));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});


// <b>Reading Request Body</b>
// The request body arrives as a stream. Collect chunks and parse when complete.
const bodyServer = createServer(async (req, res) => {
  if (req.method === 'POST') {
    const chunks = [];
    
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    
    const body = Buffer.concat(chunks).toString();
    const data = JSON.parse(body);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: data }));
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});


// <b>Request Headers</b>
// Access request headers through req.headers (lowercase keys).
const headerServer = createServer((req, res) => {
  const userAgent = req.headers['user-agent'];
  const contentType = req.headers['content-type'];
  const auth = req.headers['authorization'];
  
  console.log('User-Agent:', userAgent);
  console.log('Content-Type:', contentType);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ headers: req.headers }));
});


// <b>Response Headers</b>
// Set response headers using writeHead() or setHeader().
const responseServer = createServer((req, res) => {
  // Method 1: writeHead sets status and headers together
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'X-Custom-Header': 'CustomValue'
  });
  
  // Method 2: setHeader for individual headers (before writeHead)
  // res.setHeader('Content-Type', 'application/json');
  // res.statusCode = 200;
  
  res.end(JSON.stringify({ status: 'ok' }));
});


// <b>Handling Query Parameters</b>
// Parse URL query parameters using the URL class.
const queryServer = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const searchParams = url.searchParams;
  
  const name = searchParams.get('name') || 'Guest';
  const page = parseInt(searchParams.get('page')) || 1;
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    path: url.pathname,
    name, 
    page 
  }));
});


// <b>Streaming Response</b>
// For large responses, write in chunks instead of buffering.
const streamServer = createServer((req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked'
  });
  
  let count = 0;
  const interval = setInterval(() => {
    res.write(`Chunk ${++count}\n`);
    if (count >= 5) {
      clearInterval(interval);
      res.end('Done!\n');
    }
  }, 500);
});


// <b>CORS Headers</b>
// Add Cross-Origin Resource Sharing headers for browser requests.
const corsServer = createServer((req, res) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }
  
  // Regular response with CORS headers
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({ data: 'Hello from API' }));
});


// <b>Server Events</b>
// The server emits events you can listen to.
const eventServer = createServer((req, res) => {
  res.end('OK');
});

eventServer.on('connection', (socket) => {
  console.log('New connection from:', socket.remoteAddress);
});

eventServer.on('error', (err) => {
  console.error('Server error:', err);
});

eventServer.on('listening', () => {
  const addr = eventServer.address();
  console.log(`Listening on ${addr.address}:${addr.port}`);
});


// <b>Graceful Shutdown</b>
// Handle process signals to shut down cleanly.
const gracefulServer = createServer((req, res) => {
  res.end('Hello');
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  gracefulServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});


// <b>Complete Example: Simple API Server</b>
// A practical example combining multiple concepts.
const apiServer = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  try {
    if (url.pathname === '/api/time' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        time: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }));
    }
    else if (url.pathname === '/api/echo' && req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      res.writeHead(200);
      res.end(JSON.stringify({ echoed: body }));
    }
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
});

apiServer.listen(3001, () => {
  console.log('API server running at http://localhost:3001/');
});
