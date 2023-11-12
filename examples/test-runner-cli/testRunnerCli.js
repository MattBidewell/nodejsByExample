// The test runner also contains multiple command line options that allow you to customize the behavior of the test runner.
import test from 'node:test';


//1. By adding the <b><i>--test-only</b></i> flag you can execute tests that have the <b>only</b> option set to true.
test('only test', { only: true }, (t) => {
  assert.strictEqual(1, 1);
});

test('This test will not run', () => {
  throw new Error('This test will not run');
});


//2. Using the flag <b><i>--test-name-pattern</b></i> you can run tests whose name matches the given pattern. The pattern is interpreted as a regular expression. You can also chain <b><i>--test-name-pattern</b></i> flag to run multiple tests.
// <br>Using the following flag <b><i>--test-name-pattern="test [1-2]"</b></i> will run test 1 and test 2.
test('test 1', (t) => {
  assert.strictEqual(1, 1);
});

test('test 2', (t) => {
  assert.strictEqual(1, 1);
});

test('test 3', (t) => {
  assert.strictEqual(1, 1);
});
