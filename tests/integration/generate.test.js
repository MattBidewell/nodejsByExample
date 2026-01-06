/**
 * Integration Tests for Site Generator
 * 
 * Tests the full site generation process with snapshot comparison.
 * Uses test fixtures to verify output matches expected HTML.
 * 
 * Run tests: npm test
 * Update snapshots: npm run test:update-snapshots
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { buildSite } from '../../tools/generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures');
const SNAPSHOTS_DIR = path.join(__dirname, '..', 'snapshots');
const OUTPUT_DIR = path.join(__dirname, '..', '.output');
const TEMPLATES_DIR = path.join(__dirname, '..', '..', 'templates');

/**
 * Helper to read file contents
 */
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Helper to check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Site Generation - Integration Tests', () => {
  before(() => {
    // Clean and create output directory
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Run the generator with test fixtures
    buildSite({
      siteDir: OUTPUT_DIR,
      templateDir: TEMPLATES_DIR,
      examplesDir: FIXTURES_DIR,
      contentsFile: path.join(FIXTURES_DIR, 'contents.json')
    });
  });

  after(() => {
    // Cleanup output directory
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  describe('File Generation', () => {
    it('generates index.html', () => {
      const indexPath = path.join(OUTPUT_DIR, 'index.html');
      assert.strictEqual(fileExists(indexPath), true, 'index.html should exist');
    });

    it('generates simple-example.html', () => {
      const filePath = path.join(OUTPUT_DIR, 'simple-example.html');
      assert.strictEqual(fileExists(filePath), true, 'simple-example.html should exist');
    });

    it('generates edge-cases.html', () => {
      const filePath = path.join(OUTPUT_DIR, 'edge-cases.html');
      assert.strictEqual(fileExists(filePath), true, 'edge-cases.html should exist');
    });

    it('generates code-only.html', () => {
      const filePath = path.join(OUTPUT_DIR, 'code-only.html');
      assert.strictEqual(fileExists(filePath), true, 'code-only.html should exist');
    });

    it('generates async-programming.html', () => {
      const filePath = path.join(OUTPUT_DIR, 'async-programming.html');
      assert.strictEqual(fileExists(filePath), true, 'async-programming.html should exist');
    });
  });

  describe('Snapshot Comparison', () => {
    it('index.html matches snapshot', () => {
      const actual = readFile(path.join(OUTPUT_DIR, 'index.html'));
      const expected = readFile(path.join(SNAPSHOTS_DIR, 'index.html'));
      assert.strictEqual(actual, expected, 'index.html should match snapshot');
    });

    it('simple-example.html matches snapshot', () => {
      const actual = readFile(path.join(OUTPUT_DIR, 'simple-example.html'));
      const expected = readFile(path.join(SNAPSHOTS_DIR, 'simple-example.html'));
      assert.strictEqual(actual, expected, 'simple-example.html should match snapshot');
    });

    it('edge-cases.html matches snapshot', () => {
      const actual = readFile(path.join(OUTPUT_DIR, 'edge-cases.html'));
      const expected = readFile(path.join(SNAPSHOTS_DIR, 'edge-cases.html'));
      assert.strictEqual(actual, expected, 'edge-cases.html should match snapshot');
    });

    it('code-only.html matches snapshot', () => {
      const actual = readFile(path.join(OUTPUT_DIR, 'code-only.html'));
      const expected = readFile(path.join(SNAPSHOTS_DIR, 'code-only.html'));
      assert.strictEqual(actual, expected, 'code-only.html should match snapshot');
    });

    it('async-programming.html matches snapshot', () => {
      const actual = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      const expected = readFile(path.join(SNAPSHOTS_DIR, 'async-programming.html'));
      assert.strictEqual(actual, expected, 'async-programming.html should match snapshot');
    });
  });

  describe('Index Page Structure', () => {
    it('contains links to all examples', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'index.html'));
      assert.ok(html.includes('href="simple-example"'), 'should link to simple-example');
      assert.ok(html.includes('href="edge-cases"'), 'should link to edge-cases');
      assert.ok(html.includes('href="code-only"'), 'should link to code-only');
      assert.ok(html.includes('href="async-programming"'), 'should link to async-programming');
    });

    it('displays example titles', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'index.html'));
      assert.ok(html.includes('Simple Example'), 'should display Simple Example title');
      assert.ok(html.includes('Edge Cases'), 'should display Edge Cases title');
      assert.ok(html.includes('Code Only'), 'should display Code Only title');
      assert.ok(html.includes('Async Programming'), 'should display Async Programming title');
    });

    it('has correct navigation for index (wraps around)', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'index.html'));
      // Index should have last example as previous, first as next
      assert.ok(html.includes("previous: 'async-programming'"), 'previous should be last example');
      assert.ok(html.includes("next: 'simple-example'"), 'next should be first example');
    });
  });

  describe('Content Page Structure', () => {
    it('includes page title in header', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'simple-example.html'));
      assert.ok(html.includes('NodeJS by Example: Simple Example'), 'should include title');
    });

    it('renders comments in table cells', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'simple-example.html'));
      assert.ok(html.includes('This is a <b>simple</b> example'), 'should render HTML in comments');
    });

    it('applies syntax highlighting to code', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'simple-example.html'));
      assert.ok(html.includes('class="hljs"'), 'should have hljs class');
      assert.ok(html.includes('hljs-keyword'), 'should have syntax highlighting spans');
    });

    it('renders shell scripts in separate table', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'simple-example.html'));
      assert.ok(html.includes('node example.js'), 'should include shell command');
      assert.ok(html.includes('Run the example with Node.js'), 'should include shell comment');
    });
  });

  describe('Navigation Links', () => {
    it('first example has "/" as previous link', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'simple-example.html'));
      assert.ok(html.includes("previous: '/'"), 'first example should have / as previous');
    });

    it('first example has correct next link', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'simple-example.html'));
      assert.ok(html.includes("next: 'edge-cases'"), 'first example should link to second');
    });

    it('last example has "/" as next link', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      assert.ok(html.includes("next: '/'"), 'last example should have / as next');
    });

    it('last example has correct previous link', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      assert.ok(html.includes("previous: 'code-only'"), 'last example should link to previous');
    });

    it('middle examples have correct navigation', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'edge-cases.html'));
      assert.ok(html.includes("previous: 'simple-example'"), 'should link to previous');
      assert.ok(html.includes("next: 'code-only'"), 'should link to next');
    });
  });

  // ==========================================================================
  // EDGE CASES TESTS
  // ==========================================================================
  
  describe('Edge Cases Handling', () => {
    it('skips empty subdirectories gracefully', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'edge-cases.html'));
      // Subdir 2 is empty, should skip it and render subdir 1 and 3
      assert.ok(html.includes('Edge Case 1'), 'should have subdir 1 content');
      assert.ok(html.includes('Edge Case 3'), 'should have subdir 3 content');
    });

    it('handles special characters in comments', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'edge-cases.html'));
      // Comments can contain < > & " ' characters
      assert.ok(html.includes('Testing special chars'), 'should have special chars comment');
    });

    it('escapes HTML entities in code strings', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'edge-cases.html'));
      // Code containing HTML should be escaped in the output
      assert.ok(html.includes('&lt;div'), 'should escape < in code');
      assert.ok(html.includes('&gt;'), 'should escape > in code');
    });

    it('renders content after skipped empty subdir', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'edge-cases.html'));
      assert.ok(html.includes('Valid code after empty subdir'), 'should render subdir 3');
      assert.ok(html.includes('Subdir 2 was empty but this works'), 'should have code from subdir 3');
    });
  });

  // ==========================================================================
  // CODE-ONLY TESTS (no shell scripts)
  // ==========================================================================
  
  describe('Code-Only Examples (no shell scripts)', () => {
    it('renders pages without shell scripts', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'code-only.html'));
      assert.ok(html.includes('Arrays'), 'should have Arrays content');
      assert.ok(html.includes('Objects'), 'should have Objects content');
    });

    it('has empty shell table when no .sh file exists', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'code-only.html'));
      // There should be empty <table></table> elements for shell content
      assert.ok(html.includes('<table>\n      </table>'), 'should have empty shell tables');
    });

    it('renders multiple code sections from arrays example', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'code-only.html'));
      assert.ok(html.includes('map() transforms each element'), 'should have map section');
      assert.ok(html.includes('filter() selects elements'), 'should have filter section');
      assert.ok(html.includes('reduce() combines elements'), 'should have reduce section');
    });

    it('renders object examples with complex syntax', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'code-only.html'));
      assert.ok(html.includes('Object destructuring'), 'should have destructuring');
      assert.ok(html.includes('Spread operator'), 'should have spread operator');
    });

    it('applies syntax highlighting to arrow functions', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'code-only.html'));
      // Arrow functions should be highlighted
      assert.ok(html.includes('=&gt;'), 'should have arrow function syntax');
    });
  });

  // ==========================================================================
  // ASYNC PROGRAMMING TESTS (multi-section + multi-subdir example)
  // ==========================================================================
  
  describe('Async Programming Example (Multi-Section & Multi-Subdir)', () => {
    it('renders multiple sections from same file (triple newline split)', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      // async-basics.js has multiple sections separated by triple newlines
      assert.ok(html.includes('Callbacks'), 'should have callbacks section');
      assert.ok(html.includes('Promises'), 'should have promises section');
    });

    it('renders content from multiple subdirectories in order', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      // Content should come from subdirs 1, 2, 3 in order
      assert.ok(html.includes('fetchData'), 'should have subdir 1 content');
      assert.ok(html.includes('Async/Await'), 'should have subdir 2 content');
      assert.ok(html.includes('Parallel Async'), 'should have subdir 3 content');
    });

    it('processes subdirectories in numeric order', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      const callbacksIndex = html.indexOf('Callbacks');
      const asyncAwaitIndex = html.indexOf('Async/Await');
      const parallelIndex = html.indexOf('Parallel Async');
      
      assert.ok(callbacksIndex < asyncAwaitIndex, 'callbacks should come before async/await');
      assert.ok(asyncAwaitIndex < parallelIndex, 'async/await should come before parallel');
    });

    it('renders all major async topics', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      assert.ok(html.includes('Async Programming'), 'should have intro');
      assert.ok(html.includes('Callbacks'), 'should have callbacks section');
      assert.ok(html.includes('Promises'), 'should have promises section');
      assert.ok(html.includes('Async/Await'), 'should have async/await section');
    });

    it('renders parallel async operations content', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      assert.ok(html.includes('Promise.all()'), 'should have Promise.all');
      assert.ok(html.includes('Promise.allSettled()'), 'should have Promise.allSettled');
      assert.ok(html.includes('Promise.race()'), 'should have Promise.race');
    });

    it('handles code with template literals', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      // Template literals with ${} should be preserved
      assert.ok(html.includes('${'), 'should preserve template literal syntax');
    });

    it('renders shell script examples from multiple subdirs', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      assert.ok(html.includes('node async-basics.js'), 'should have shell command from subdir 1');
      assert.ok(html.includes('node parallel-async.js'), 'should have shell command from subdir 3');
    });

    it('preserves complex code indentation in highlighting', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      // Check that try/catch blocks are present (complex indentation)
      assert.ok(html.includes('>try<'), 'should have try keyword');
      assert.ok(html.includes('>catch<'), 'should have catch keyword');
    });

    it('handles async/await keywords with highlighting', () => {
      const html = readFile(path.join(OUTPUT_DIR, 'async-programming.html'));
      // async and await should have keyword highlighting
      assert.ok(html.includes('hljs-keyword">async'), 'should highlight async keyword');
      assert.ok(html.includes('hljs-keyword">await'), 'should highlight await keyword');
    });
  });

  // ==========================================================================
  // COMPREHENSIVE OUTPUT VERIFICATION
  // ==========================================================================
  
  describe('Comprehensive Output Verification', () => {
    it('all generated files have valid HTML structure', () => {
      const files = ['index.html', 'simple-example.html', 
                     'edge-cases.html', 'code-only.html', 'async-programming.html'];
      
      for (const file of files) {
        const html = readFile(path.join(OUTPUT_DIR, file));
        assert.ok(html.startsWith('<!DOCTYPE html>'), `${file} should start with DOCTYPE`);
        assert.ok(html.includes('<html>'), `${file} should have html tag`);
        assert.ok(html.includes('</html>'), `${file} should close html tag`);
        assert.ok(html.includes('<title>NodeJS by Example</title>'), `${file} should have title`);
      }
    });

    it('all content pages have footer', () => {
      const files = ['simple-example.html', 
                     'edge-cases.html', 'code-only.html', 'async-programming.html'];
      
      for (const file of files) {
        const html = readFile(path.join(OUTPUT_DIR, file));
        assert.ok(html.includes('id="footer"'), `${file} should have footer`);
        assert.ok(html.includes('Matt Bidewell'), `${file} should credit author`);
      }
    });

    it('all content pages have navigation script', () => {
      const files = ['simple-example.html', 
                     'edge-cases.html', 'code-only.html', 'async-programming.html'];
      
      for (const file of files) {
        const html = readFile(path.join(OUTPUT_DIR, file));
        assert.ok(html.includes('ArrowLeft'), `${file} should have left arrow handler`);
        assert.ok(html.includes('ArrowRight'), `${file} should have right arrow handler`);
      }
    });

    it('all content pages link back to index', () => {
      const files = ['simple-example.html', 
                     'edge-cases.html', 'code-only.html', 'async-programming.html'];
      
      for (const file of files) {
        const html = readFile(path.join(OUTPUT_DIR, file));
        assert.ok(html.includes('href="./"'), `${file} should link to index`);
      }
    });
  });
});
