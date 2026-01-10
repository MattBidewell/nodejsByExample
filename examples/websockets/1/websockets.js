// <b>WebSocket</b> provides full-duplex communication over a single TCP connection. Node.js 22+ includes a built-in WebSocket client (the server still requires a library).


// <b>Connecting to a WebSocket Server</b>
// Create a WebSocket connection to a server endpoint.
const ws = new WebSocket('wss://echo.websocket.org');


// <b>Connection Events</b>
// WebSocket emits events for connection lifecycle.
ws.addEventListener('open', () => {
  console.log('Connected to server');
  
  // Send a message once connected
  ws.send('Hello, WebSocket!');
});

ws.addEventListener('close', (event) => {
  console.log('Disconnected:', event.code, event.reason);
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error.message);
});


// <b>Receiving Messages</b>
// Handle incoming messages with the 'message' event.
ws.addEventListener('message', (event) => {
  console.log('Received:', event.data);
});


// <b>Sending Messages</b>
// Send strings or binary data (ArrayBuffer, Blob) to the server.
function sendMessages(socket) {
  // Send string
  socket.send('Hello, server!');
  
  // Send JSON
  socket.send(JSON.stringify({ type: 'greeting', message: 'Hi!' }));
  
  // Send binary data
  const buffer = new Uint8Array([1, 2, 3, 4, 5]);
  socket.send(buffer);
}


// <b>Connection State</b>
// Check the readyState property to know the connection status.
function checkState(socket) {
  switch (socket.readyState) {
    case WebSocket.CONNECTING: // 0
      console.log('Connecting...');
      break;
    case WebSocket.OPEN: // 1
      console.log('Connected');
      break;
    case WebSocket.CLOSING: // 2
      console.log('Closing...');
      break;
    case WebSocket.CLOSED: // 3
      console.log('Closed');
      break;
  }
}


// <b>Closing the Connection</b>
// Close the connection gracefully with optional code and reason.
function closeConnection(socket) {
  // Normal closure
  socket.close();
  
  // With close code and reason
  socket.close(1000, 'Normal closure');
  
  // Common close codes:
  // 1000 - Normal closure
  // 1001 - Going away (page closing)
  // 1002 - Protocol error
  // 1003 - Unsupported data type
  // 1008 - Policy violation
  // 1011 - Server error
}


// <b>Buffered Data</b>
// Check how much data is queued for sending.
function checkBuffer(socket) {
  console.log('Buffered bytes:', socket.bufferedAmount);
  
  // Wait for buffer to clear before sending more
  if (socket.bufferedAmount === 0) {
    socket.send('More data');
  }
}


// <b>Binary Data Handling</b>
// Configure how binary data is received.
function configureBinary(socket) {
  // Receive binary as ArrayBuffer (default)
  socket.binaryType = 'arraybuffer';
  
  // Or receive as Blob
  socket.binaryType = 'blob';
}

// Handle binary messages
function handleBinary(event) {
  if (event.data instanceof ArrayBuffer) {
    const view = new Uint8Array(event.data);
    console.log('Binary data:', view);
  }
}


// <b>Reconnection Logic</b>
// Implement automatic reconnection when connection drops.
function createReconnectingSocket(url, options = {}) {
  const { maxRetries = 5, baseDelay = 1000 } = options;
  let retries = 0;
  let socket = null;
  
  function connect() {
    socket = new WebSocket(url);
    
    socket.addEventListener('open', () => {
      console.log('Connected');
      retries = 0; // Reset on successful connection
    });
    
    socket.addEventListener('close', (event) => {
      if (event.code !== 1000 && retries < maxRetries) {
        const delay = baseDelay * Math.pow(2, retries);
        console.log(`Reconnecting in ${delay}ms...`);
        setTimeout(connect, delay);
        retries++;
      }
    });
    
    socket.addEventListener('error', () => {
      // Error event is always followed by close
    });
    
    return socket;
  }
  
  return connect();
}


// <b>Heartbeat/Ping-Pong</b>
// Keep connection alive with periodic pings.
function setupHeartbeat(socket) {
  const HEARTBEAT_INTERVAL = 30000; // 30 seconds
  
  const heartbeat = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
    }
  }, HEARTBEAT_INTERVAL);
  
  socket.addEventListener('close', () => {
    clearInterval(heartbeat);
  });
  
  // Handle pong from server
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'pong') {
      console.log('Heartbeat acknowledged');
    }
  });
}


// <b>Message Queue</b>
// Queue messages when connection is not ready.
class WebSocketWithQueue {
  constructor(url) {
    this.url = url;
    this.queue = [];
    this.connect();
  }
  
  connect() {
    this.socket = new WebSocket(this.url);
    
    this.socket.addEventListener('open', () => {
      // Flush queued messages
      while (this.queue.length > 0) {
        const message = this.queue.shift();
        this.socket.send(message);
      }
    });
  }
  
  send(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      this.queue.push(message);
    }
  }
}


// <b>Practical Example: Chat Client</b>
// A simple chat client implementation.
class ChatClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.handlers = new Map();
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.serverUrl);
      
      this.socket.addEventListener('open', () => {
        console.log('Chat connected');
        resolve();
      });
      
      this.socket.addEventListener('error', reject);
      
      this.socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        const handler = this.handlers.get(message.type);
        if (handler) handler(message);
      });
    });
  }
  
  on(type, handler) {
    this.handlers.set(type, handler);
  }
  
  sendMessage(text) {
    this.socket.send(JSON.stringify({
      type: 'message',
      text,
      timestamp: Date.now()
    }));
  }
  
  joinRoom(room) {
    this.socket.send(JSON.stringify({
      type: 'join',
      room
    }));
  }
  
  disconnect() {
    this.socket.close(1000, 'User disconnected');
  }
}

// Usage example (won't run without a real server)
async function chatExample() {
  const chat = new ChatClient('wss://chat.example.com');
  
  chat.on('message', (msg) => {
    console.log(`[${msg.user}]: ${msg.text}`);
  });
  
  chat.on('userJoined', (msg) => {
    console.log(`${msg.user} joined the room`);
  });
  
  await chat.connect();
  chat.joinRoom('general');
  chat.sendMessage('Hello everyone!');
}
