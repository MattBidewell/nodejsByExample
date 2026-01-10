// Run the HTTP server
$ node http-server.js
# Server running at http://localhost:3000/
# API server running at http://localhost:3001/


// Test the basic server (in another terminal)
$ curl http://localhost:3000
# Hello, World!


// Test the API endpoints
$ curl http://localhost:3001/api/time
# {"time":"2025-01-10T12:00:00.000Z","timezone":"UTC"}

$ curl -X POST http://localhost:3001/api/echo -H "Content-Type: application/json" -d '{"message":"hello"}'
# {"echoed":{"message":"hello"}}
