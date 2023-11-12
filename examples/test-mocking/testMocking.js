// The core Node:test module supports mocking via a top-level `mock` object.

import { mock, test } from 'node:test';
import assert from 'node:assert/strict';

test('Mocking', () => {
  const sum = mock.fn((a, b) => a + b);
  assert.strictEqual(sum(1, 2), 3);
  assert.strictEqual(sum.mock.calls.length, 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [1, 2]);

  mock.reset();
});