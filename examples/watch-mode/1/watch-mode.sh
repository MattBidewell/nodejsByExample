// Run in watch mode
$ node --watch watch-mode.js
# Server starting...
# Server running at http://localhost:3000/
# Modify this file and save to see auto-restart

// When you save the file:
# Restarting 'watch-mode.js'
# Server starting...
# Server running at http://localhost:3000/


// Watch specific paths
$ node --watch --watch-path=./src server.js


// Combine with debugging
$ node --watch --inspect server.js
# Debugger listening on ws://127.0.0.1:9229/...
