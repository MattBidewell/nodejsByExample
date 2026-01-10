// <b>Subtests</b> allow you to create nested test hierarchies dynamically. Use t.test() inside a test to create subtests that inherit context and hooks.


// Import test function
import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';


// <b>Basic Subtests</b>
// Use t.test() to create tests within tests.
test('Math operations', async (t) => {
  await t.test('addition', () => {
    assert.equal(2 + 2, 4);
  });
  
  await t.test('subtraction', () => {
    assert.equal(5 - 3, 2);
  });
  
  await t.test('multiplication', () => {
    assert.equal(3 * 4, 12);
  });
});


// <b>Nested Subtests</b>
// Subtests can be nested multiple levels deep.
test('String methods', async (t) => {
  await t.test('case methods', async (t) => {
    await t.test('toUpperCase', () => {
      assert.equal('hello'.toUpperCase(), 'HELLO');
    });
    
    await t.test('toLowerCase', () => {
      assert.equal('WORLD'.toLowerCase(), 'world');
    });
  });
  
  await t.test('search methods', async (t) => {
    await t.test('includes', () => {
      assert.ok('hello world'.includes('world'));
    });
    
    await t.test('startsWith', () => {
      assert.ok('hello'.startsWith('hel'));
    });
  });
});


// <b>Dynamic Subtests</b>
// Generate subtests dynamically with loops.
test('Array sorting', async (t) => {
  const testCases = [
    { input: [3, 1, 2], expected: [1, 2, 3] },
    { input: [5, 5, 5], expected: [5, 5, 5] },
    { input: [], expected: [] },
    { input: [1], expected: [1] }
  ];
  
  for (const { input, expected } of testCases) {
    await t.test(`sorts ${JSON.stringify(input)}`, () => {
      const result = [...input].sort((a, b) => a - b);
      assert.deepEqual(result, expected);
    });
  }
});


// <b>Subtests with Setup</b>
// Subtests can share setup from parent test.
test('User operations', async (t) => {
  // Setup for all subtests
  const users = new Map();
  let nextId = 1;
  
  const createUser = (name) => {
    const id = nextId++;
    users.set(id, { id, name });
    return id;
  };
  
  await t.test('create user', () => {
    const id = createUser('Alice');
    assert.equal(users.size, 1);
    assert.equal(users.get(id).name, 'Alice');
  });
  
  await t.test('create another user', () => {
    const id = createUser('Bob');
    assert.equal(users.size, 2); // Both users exist
  });
  
  await t.test('users persist across subtests', () => {
    assert.equal(users.size, 2);
    assert.ok([...users.values()].some(u => u.name === 'Alice'));
  });
});


// <b>Independent Subtests</b>
// Each subtest can have its own isolated setup.
test('Independent setups', async (t) => {
  await t.test('test with list', () => {
    const list = [1, 2, 3];
    list.push(4);
    assert.equal(list.length, 4);
  });
  
  await t.test('test with map', () => {
    const map = new Map();
    map.set('key', 'value');
    assert.equal(map.get('key'), 'value');
  });
});


// <b>Async Subtests</b>
// Subtests handle async operations naturally.
test('Async operations', async (t) => {
  await t.test('resolving promise', async () => {
    const result = await Promise.resolve(42);
    assert.equal(result, 42);
  });
  
  await t.test('timeout', async () => {
    await new Promise(r => setTimeout(r, 10));
    assert.ok(true);
  });
  
  await t.test('parallel async', async () => {
    const results = await Promise.all([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3)
    ]);
    assert.deepEqual(results, [1, 2, 3]);
  });
});


// <b>Skipping Subtests</b>
// Skip subtests conditionally.
test('Conditional subtests', async (t) => {
  await t.test('always runs', () => {
    assert.ok(true);
  });
  
  await t.test('skipped test', { skip: true }, () => {
    assert.fail('This should not run');
  });
  
  await t.test('conditionally skipped', { skip: process.platform === 'win32' }, () => {
    // Skip on Windows
    assert.ok(true);
  });
});


// <b>TODO Subtests</b>
// Mark subtests as TODO (work in progress).
test('Feature in progress', async (t) => {
  await t.test('implemented', () => {
    assert.ok(true);
  });
  
  await t.test('not yet implemented', { todo: true }, () => {
    // This test is marked as TODO
    assert.fail('Not implemented');
  });
  
  await t.test('todo with message', { todo: 'waiting for API' }, () => {
    assert.fail('API not ready');
  });
});


// <b>Combining with describe/it</b>
// You can mix test() with describe/it patterns.
describe('API Client', () => {
  it('supports subtests too', async (t) => {
    await t.test('GET request', () => {
      assert.ok(true);
    });
    
    await t.test('POST request', () => {
      assert.ok(true);
    });
  });
});


// <b>Practical Example: Data Validation</b>
// Test a validation function with multiple cases.
function validate(data) {
  const errors = [];
  if (!data.name) errors.push('name is required');
  if (!data.email) errors.push('email is required');
  if (data.email && !data.email.includes('@')) {
    errors.push('email is invalid');
  }
  if (data.age && data.age < 0) errors.push('age must be positive');
  return errors;
}

test('Validation', async (t) => {
  await t.test('valid data', async (t) => {
    const valid = { name: 'Alice', email: 'alice@test.com', age: 25 };
    assert.deepEqual(validate(valid), []);
  });
  
  await t.test('invalid data', async (t) => {
    await t.test('missing name', () => {
      const result = validate({ email: 'test@test.com' });
      assert.ok(result.includes('name is required'));
    });
    
    await t.test('missing email', () => {
      const result = validate({ name: 'Test' });
      assert.ok(result.includes('email is required'));
    });
    
    await t.test('invalid email format', () => {
      const result = validate({ name: 'Test', email: 'invalid' });
      assert.ok(result.includes('email is invalid'));
    });
    
    await t.test('negative age', () => {
      const result = validate({ name: 'Test', email: 't@t.com', age: -5 });
      assert.ok(result.includes('age must be positive'));
    });
  });
});


// <b>Practical Example: API Endpoints</b>
// Test multiple endpoints in a structured way.
test('API Endpoints', async (t) => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  
  await t.test('/posts', async (t) => {
    await t.test('GET returns array', async () => {
      const res = await fetch(`${baseUrl}/posts`);
      const data = await res.json();
      assert.ok(Array.isArray(data));
    });
    
    await t.test('GET /posts/1 returns single post', async () => {
      const res = await fetch(`${baseUrl}/posts/1`);
      const data = await res.json();
      assert.equal(data.id, 1);
    });
  });
  
  await t.test('/users', async (t) => {
    await t.test('GET returns users', async () => {
      const res = await fetch(`${baseUrl}/users`);
      const data = await res.json();
      assert.ok(data.length > 0);
    });
  });
});
