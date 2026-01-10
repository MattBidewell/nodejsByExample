// <b>Error Handling</b> in Node.js is crucial for building robust applications. This guide covers error types, patterns, and best practices.


// <b>Error Types in Node.js</b>
// Node.js has several built-in error types.

// Standard JavaScript errors
const syntaxError = new SyntaxError('Invalid syntax');
const typeError = new TypeError('Expected a string');
const rangeError = new RangeError('Value out of range');
const referenceError = new ReferenceError('Variable not defined');

console.log('Error types:', {
  syntaxError: syntaxError.name,
  typeError: typeError.name,
  rangeError: rangeError.name
});


// <b>System Errors</b>
// Node.js system errors include additional properties.
import { readFileSync } from 'node:fs';

try {
  readFileSync('/nonexistent/file.txt');
} catch (err) {
  console.log('System Error Properties:');
  console.log('  name:', err.name);           // 'Error'
  console.log('  message:', err.message);     // Detailed message
  console.log('  code:', err.code);           // 'ENOENT'
  console.log('  syscall:', err.syscall);     // 'open'
  console.log('  path:', err.path);           // '/nonexistent/file.txt'
  console.log('  errno:', err.errno);         // -2
}


// <b>Creating Custom Errors</b>
// Extend the Error class for application-specific errors.
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
    Error.captureStackTrace(this, ValidationError);
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id '${id}' not found`);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
    this.statusCode = 404;
    Error.captureStackTrace(this, NotFoundError);
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
    Error.captureStackTrace(this, AuthenticationError);
  }
}

// Using custom errors
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('email', 'Email is required');
  }
  if (!user.email.includes('@')) {
    throw new ValidationError('email', 'Invalid email format');
  }
}

try {
  validateUser({ name: 'Alice' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`Validation failed on '${err.field}': ${err.message}`);
  }
}


// <b>Try-Catch for Synchronous Code</b>
// Handle errors in synchronous operations.
function parseJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

console.log(parseJSON('{"valid": true}'));
console.log(parseJSON('invalid json'));


// <b>Async/Await Error Handling</b>
// Use try-catch with async functions.
import { readFile } from 'node:fs/promises';

async function loadConfig(path) {
  try {
    const content = await readFile(path, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Config file not found, using defaults');
      return { default: true };
    }
    throw err; // Re-throw unexpected errors
  }
}


// <b>Promise Error Handling</b>
// Handle errors in Promise chains.
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (id <= 0) {
      reject(new ValidationError('id', 'ID must be positive'));
    } else if (id > 1000) {
      reject(new NotFoundError('User', id));
    } else {
      resolve({ id, name: 'User ' + id });
    }
  });
}

// Using .catch()
fetchUser(-1)
  .then(user => console.log(user))
  .catch(err => console.log('Error:', err.message));

// Using async/await
async function getUser(id) {
  try {
    const user = await fetchUser(id);
    return user;
  } catch (err) {
    console.log('Failed to get user:', err.message);
    return null;
  }
}


// <b>Error-First Callbacks</b>
// Traditional Node.js callback pattern.
import { stat } from 'node:fs';

stat('./package.json', (err, stats) => {
  if (err) {
    console.error('Stat error:', err.message);
    return;
  }
  console.log('File size:', stats.size);
});


// <b>EventEmitter Error Handling</b>
// Handle errors emitted by EventEmitters.
import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();

// Always add an error handler to prevent crashes
emitter.on('error', (err) => {
  console.error('Emitter error:', err.message);
});

emitter.emit('error', new Error('Something went wrong'));


// <b>Process-Level Error Handling</b>
// Catch unhandled errors at the process level.

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Log and optionally exit
});

// Uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.error('Uncaught Exception:', err);
  console.error('Origin:', origin);
  // Perform cleanup and exit
  process.exit(1);
});


// <b>Graceful Error Recovery</b>
// Implement retry logic for transient errors.
async function withRetry(fn, options = {}) {
  const { maxRetries = 3, delay = 1000, backoff = 2 } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${attempt} failed: ${err.message}`);
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime));
      }
    }
  }
  
  throw lastError;
}

// Usage:
// await withRetry(() => fetchData(url), { maxRetries: 5, delay: 500 });


// <b>Result Pattern</b>
// Return success/failure without exceptions.
function divide(a, b) {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
}

const result = divide(10, 0);
if (result.ok) {
  console.log('Result:', result.value);
} else {
  console.log('Error:', result.error);
}


// <b>Error Wrapping</b>
// Add context when re-throwing errors.
class WrappedError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'WrappedError';
    this.cause = cause;
    Error.captureStackTrace(this, WrappedError);
  }
}

async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    return user;
  } catch (err) {
    throw new WrappedError(`Failed to process user ${userId}`, err);
  }
}

// Node.js 16+ supports native error cause
function modernErrorWrapping() {
  try {
    throw new Error('Original error');
  } catch (err) {
    throw new Error('Wrapped error', { cause: err });
  }
}


// <b>Practical Example: Error Handler Middleware</b>
// Centralized error handling for applications.
function createErrorHandler() {
  const handlers = new Map();
  
  return {
    register(ErrorClass, handler) {
      handlers.set(ErrorClass, handler);
    },
    
    handle(err) {
      // Find specific handler
      for (const [ErrorClass, handler] of handlers) {
        if (err instanceof ErrorClass) {
          return handler(err);
        }
      }
      
      // Default handling
      console.error('Unhandled error:', err);
      return {
        statusCode: 500,
        message: 'Internal server error'
      };
    }
  };
}

const errorHandler = createErrorHandler();

errorHandler.register(ValidationError, (err) => ({
  statusCode: err.statusCode,
  message: err.message,
  field: err.field
}));

errorHandler.register(NotFoundError, (err) => ({
  statusCode: err.statusCode,
  message: err.message,
  resource: err.resource
}));

// Usage
const response = errorHandler.handle(
  new ValidationError('email', 'Invalid email')
);
console.log('Error response:', response);


// <b>Practical Example: Safe Async Wrapper</b>
// Wrapper for safe async execution.
function safeAsync(fn) {
  return async (...args) => {
    try {
      const result = await fn(...args);
      return [null, result];
    } catch (err) {
      return [err, null];
    }
  };
}

// Usage:
// const safeReadFile = safeAsync(readFile);
// const [err, content] = await safeReadFile('./file.txt', 'utf8');
// if (err) console.log('Error:', err.message);
// else console.log('Content:', content);


// <b>Best Practices Summary</b>
// 1. Always handle errors - never ignore them
// 2. Use custom error classes for different error types
// 3. Include useful context in error messages
// 4. Use Error.captureStackTrace for clean stack traces
// 5. Implement retry logic for transient failures
// 6. Log errors appropriately for debugging
// 7. Clean up resources in finally blocks
// 8. Fail fast - don't hide errors
// 9. Use process-level handlers as last resort
// 10. Test error handling paths
