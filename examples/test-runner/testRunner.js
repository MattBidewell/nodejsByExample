// The test runner is a new addition to the NodeJS APIs. You can now create and run tests use just the standard library. Tests create via the test module are made up of a single function that can be evaluated one of three ways.


// The test runner is only available under the <b>node:</b> schema
// We will use the assert module to test our code
import test from 'node:test';
import assert from 'node:assert/strict';


//1. A synchronous function that throws an exception. This test passes
test('synchronous passing test', (t) => {
  assert.strictEqual(1, 1);
})


//2. A synchronous function that throws an exception. This test fails. The test runner will catch the exception and report it as a failure
test('synchronous failing test', (t) => {
  assert.strictEqual(1, 2);
})


//3. An asynchronous function that returns a promise that rejects. This test fails
test('failing test using Promises', (t) => {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('This test failed'));
    });
  });
});


//4 A Callback function that is called with a single argument. This test fails
test('callback failing test', (t, done) => {
  // When the setImmediate() runs,
  // done() is invoked with an Error object
  // and the test fails.
  setImmediate(() => {
    done(new Error('callback failure'));
  });
});


//5. You can also skip tests in one of two ways, both include an optional message to pass through
test('skipped test', { skip: true /*or skip: "skipped"*/ }, (t) => {
  // This test is skipped
});

test('skipped test', (t) => {
  // add pre skip logic
  t.skip('This test is skipped');
});


//6. Like most testing frameworks you can declare a test suit using the <b>describe</b> and <b>it</b> functions
// <br><b>it</b> is an alias for <b>test</b>
import { describe, it } from 'node:test';

describe('test suite', () => {
  it('test', (t) => {
    assert.strictEqual(1, 1);
  });
});


//7.