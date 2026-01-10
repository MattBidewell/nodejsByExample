// <b>Test Coverage</b> measures how much of your code is executed during tests. Node.js has built-in coverage reporting via the --experimental-test-coverage flag.


// Import test utilities
import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';


// <b>Example Code to Test</b>
// Here's a simple module we'll write tests for.
function calculator(operation, a, b) {
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}


// <b>Tests for Calculator</b>
// Coverage is calculated based on which lines/branches are executed.
describe('Calculator', () => {
  it('adds numbers', () => {
    assert.equal(calculator('add', 2, 3), 5);
  });
  
  it('subtracts numbers', () => {
    assert.equal(calculator('subtract', 5, 3), 2);
  });
  
  it('multiplies numbers', () => {
    assert.equal(calculator('multiply', 4, 3), 12);
  });
  
  it('divides numbers', () => {
    assert.equal(calculator('divide', 10, 2), 5);
  });
  
  it('throws on division by zero', () => {
    assert.throws(
      () => calculator('divide', 10, 0),
      { message: 'Division by zero' }
    );
  });
  
  it('throws on unknown operation', () => {
    assert.throws(
      () => calculator('power', 2, 3),
      { message: 'Unknown operation: power' }
    );
  });
});


// <b>Branch Coverage</b>
// Coverage includes branches - if/else, switch cases, ternary operators.
function categorize(value) {
  if (value < 0) {
    return 'negative';
  } else if (value === 0) {
    return 'zero';
  } else if (value < 10) {
    return 'small';
  } else if (value < 100) {
    return 'medium';
  } else {
    return 'large';
  }
}

describe('Categorize', () => {
  // To get 100% branch coverage, test all paths
  it('handles negative', () => {
    assert.equal(categorize(-5), 'negative');
  });
  
  it('handles zero', () => {
    assert.equal(categorize(0), 'zero');
  });
  
  it('handles small', () => {
    assert.equal(categorize(5), 'small');
  });
  
  it('handles medium', () => {
    assert.equal(categorize(50), 'medium');
  });
  
  it('handles large', () => {
    assert.equal(categorize(100), 'large');
  });
});


// <b>Line Coverage vs Branch Coverage</b>
// A line can be covered but branches within it may not be.
function ternaryExample(condition) {
  // This line has two branches
  return condition ? 'yes' : 'no';
}

describe('Ternary', () => {
  it('true branch', () => {
    assert.equal(ternaryExample(true), 'yes');
  });
  
  it('false branch', () => {
    assert.equal(ternaryExample(false), 'no');
  });
});


// <b>Testing Edge Cases</b>
// Edge cases are important for both correctness and coverage.
function processArray(arr) {
  if (!arr || arr.length === 0) {
    return [];
  }
  
  return arr.map(item => {
    if (typeof item === 'string') {
      return item.toUpperCase();
    } else if (typeof item === 'number') {
      return item * 2;
    } else {
      return item;
    }
  });
}

describe('processArray', () => {
  it('handles null', () => {
    assert.deepEqual(processArray(null), []);
  });
  
  it('handles empty array', () => {
    assert.deepEqual(processArray([]), []);
  });
  
  it('handles strings', () => {
    assert.deepEqual(processArray(['a', 'b']), ['A', 'B']);
  });
  
  it('handles numbers', () => {
    assert.deepEqual(processArray([1, 2]), [2, 4]);
  });
  
  it('handles mixed', () => {
    assert.deepEqual(processArray(['a', 1, true]), ['A', 2, true]);
  });
});


// <b>Async Code Coverage</b>
// Coverage works with async code too.
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      if (i === retries - 1) {
        throw err;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

describe('fetchWithRetry', () => {
  it('succeeds on first try', async () => {
    const result = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1');
    assert.ok(result.id);
  });
});


// <b>Understanding Coverage Reports</b>
// The coverage report shows:
// - Line coverage: percentage of lines executed
// - Branch coverage: percentage of branches taken
// - Function coverage: percentage of functions called

// Example output:
// -------------------------------|---------|----------|---------|---------|
// File                           | % Stmts | % Branch | % Funcs | % Lines |
// -------------------------------|---------|----------|---------|---------|
// All files                      |   95.00 |    90.00 |  100.00 |   95.00 |
//  test-coverage.js              |   95.00 |    90.00 |  100.00 |   95.00 |
// -------------------------------|---------|----------|---------|---------|


// <b>Excluding Code from Coverage</b>
// Use /* c8 ignore */ comments to exclude code from coverage.
function debugOnly() {
  /* c8 ignore start */
  if (process.env.DEBUG) {
    console.log('Debug info');
  }
  /* c8 ignore stop */
  return true;
}

test('debug function', () => {
  assert.equal(debugOnly(), true);
});


// <b>Coverage Thresholds</b>
// You can set minimum coverage thresholds in your CI/CD pipeline.
// If coverage falls below the threshold, the build fails.

// Example package.json script:
// "test:coverage": "node --test --experimental-test-coverage --test-coverage-branches=80 --test-coverage-lines=80"
