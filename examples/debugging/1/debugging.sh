// Run with inspector (pauses at debugger statements)
$ node --inspect-brk debugging.js
# Debugger listening on ws://127.0.0.1:9229/uuid
# For help, see: https://nodejs.org/en/docs/inspector
# Debugger attached.

// Then open chrome://inspect in Chrome


// Run with debug output enabled
$ DEBUG=db,http node debugging.js
# [2025-01-10T12:00:00.000Z] [db] Connecting to database...
# [2025-01-10T12:00:00.001Z] [http] GET /api/users


// Enable all debug namespaces
$ DEBUG=* node debugging.js


// Profile memory (requires --expose-gc)
$ node --expose-gc debugging.js
