// <b>Test Hooks</b> let you run setup and teardown code around your tests. Node.js provides before, after, beforeEach, and afterEach hooks.


// Import test functions and hooks
import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';


// <b>before - Run Once Before All Tests</b>
// Use before() to set up resources needed by all tests in a suite.
describe('Database Tests', () => {
  let db;
  
  before(() => {
    console.log('Setting up database connection');
    db = { connected: true, data: [] };
  });
  
  after(() => {
    console.log('Closing database connection');
    db = null;
  });
  
  it('should be connected', () => {
    assert.equal(db.connected, true);
  });
  
  it('should start with empty data', () => {
    assert.deepEqual(db.data, []);
  });
});


// <b>beforeEach - Run Before Each Test</b>
// Use beforeEach() to reset state between tests.
describe('Counter Tests', () => {
  let counter;
  
  beforeEach(() => {
    // Fresh counter for each test
    counter = { value: 0 };
  });
  
  it('should start at zero', () => {
    assert.equal(counter.value, 0);
  });
  
  it('can be incremented', () => {
    counter.value++;
    assert.equal(counter.value, 1);
  });
  
  it('still starts at zero', () => {
    // beforeEach reset the counter
    assert.equal(counter.value, 0);
  });
});


// <b>afterEach - Run After Each Test</b>
// Use afterEach() for cleanup after each test.
describe('File Tests', () => {
  let tempFiles = [];
  
  afterEach(() => {
    // Clean up any temp files created by the test
    console.log('Cleaning up:', tempFiles.length, 'files');
    tempFiles = [];
  });
  
  it('creates temp file 1', () => {
    tempFiles.push('temp1.txt');
    assert.ok(tempFiles.includes('temp1.txt'));
  });
  
  it('creates temp file 2', () => {
    tempFiles.push('temp2.txt');
    // tempFiles was cleaned, so only temp2.txt exists
    assert.equal(tempFiles.length, 1);
  });
});


// <b>Async Hooks</b>
// Hooks can be async - tests wait for them to complete.
describe('Async Setup', () => {
  let data;
  
  before(async () => {
    // Simulate async setup
    data = await new Promise(resolve => {
      setTimeout(() => resolve({ loaded: true }), 100);
    });
  });
  
  it('has loaded data', () => {
    assert.equal(data.loaded, true);
  });
});


// <b>Hook Execution Order</b>
// Hooks run in a specific order.
describe('Hook Order', () => {
  before(() => console.log('1. before'));
  beforeEach(() => console.log('2. beforeEach'));
  afterEach(() => console.log('4. afterEach'));
  after(() => console.log('5. after'));
  
  it('test 1', () => console.log('3. test 1'));
  it('test 2', () => console.log('3. test 2'));
});

// Output:
// 1. before
// 2. beforeEach
// 3. test 1
// 4. afterEach
// 2. beforeEach
// 3. test 2
// 4. afterEach
// 5. after


// <b>Nested Describe Blocks</b>
// Hooks in nested describes run outer-first for setup, inner-first for teardown.
describe('Outer', () => {
  before(() => console.log('Outer before'));
  beforeEach(() => console.log('Outer beforeEach'));
  
  describe('Inner', () => {
    before(() => console.log('Inner before'));
    beforeEach(() => console.log('Inner beforeEach'));
    
    it('nested test', () => {
      console.log('Test runs');
    });
  });
});

// Order: Outer before, Inner before, Outer beforeEach, Inner beforeEach, Test


// <b>Hooks with Context</b>
// Access test context in hooks via the first argument.
describe('Context Example', () => {
  beforeEach((t) => {
    console.log('Running before:', t.name);
  });
  
  it('test with context', (t) => {
    console.log('Test name:', t.name);
    assert.ok(true);
  });
});


// <b>Error Handling in Hooks</b>
// If a hook throws, tests in that suite are skipped/failed.
describe('Hook Errors', () => {
  before(() => {
    // If this throws, all tests in this describe are skipped
    // throw new Error('Setup failed');
  });
  
  it('only runs if before succeeds', () => {
    assert.ok(true);
  });
});


// <b>Practical Example: Testing with Mock Server</b>
// Set up and tear down a test server.
describe('API Integration Tests', () => {
  let server;
  let baseUrl;
  
  before(async () => {
    // Start mock server
    const { createServer } = await import('node:http');
    server = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    });
    
    await new Promise(resolve => {
      server.listen(0, () => {
        baseUrl = `http://localhost:${server.address().port}`;
        resolve();
      });
    });
  });
  
  after(async () => {
    await new Promise(resolve => server.close(resolve));
  });
  
  it('responds with status ok', async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    assert.equal(data.status, 'ok');
  });
});


// <b>Practical Example: Database Transactions</b>
// Wrap each test in a transaction and rollback.
describe('Transaction Tests', () => {
  let db;
  
  before(() => {
    // Initialize database
    db = {
      data: [],
      insert(item) { this.data.push(item); },
      clear() { this.data = []; }
    };
  });
  
  beforeEach(() => {
    // Start with clean data
    db.clear();
    db.insert({ id: 1, name: 'seed' });
  });
  
  it('can add items', () => {
    db.insert({ id: 2, name: 'test' });
    assert.equal(db.data.length, 2);
  });
  
  it('starts fresh each time', () => {
    // beforeEach cleared previous test's additions
    assert.equal(db.data.length, 1);
    assert.equal(db.data[0].name, 'seed');
  });
});
