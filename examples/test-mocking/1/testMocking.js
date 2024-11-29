// The core Node:test module supports mocking via a top-level `mock` object.

import { mock, test } from 'node:test';
import assert from 'node:assert/strict';

// 1. The mock object has a `fn` method that returns a mock function. You can then assert values such as the number of times the function was called, the arguments it was called with, and the return value.
test('Mocking', () => {
  const sum = mock.fn((a, b) => a + b);
  assert.strictEqual(sum(1, 2), 3);
  assert.strictEqual(sum.mock.calls.length, 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [1, 2]);

  mock.reset();
});


// 2. Mocking timers allows you to simulate the behavior of the Node.js timers such as `setTimeout` and `setInterval`. This allows you to test code that uses timers without having to wait for the timers to expire.
test('Mocking timers', () => {
  const fn = mock.fn();
  mock.timers.enable(['setTimeout']);
  setTimeout(fn, 100);
  assert.strictEqual(fn.mock.calls.length, 0);

  // Fast-forward the timers
  mock.timers.tick(100);
  assert.strictEqual(fn.mock.calls.length, 1);

  mock.timers.reset();

  // Reseting the mock instance will also reset the timers\
  mock.reset();
});