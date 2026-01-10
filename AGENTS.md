# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working in the nodejsByExample repository.
This is a static site generator that creates tutorial pages for learning Node.js by example.

## Project Overview

- **Purpose**: Generate a static documentation site teaching Node.js concepts through executable examples
- **Stack**: Plain JavaScript (ES Modules), Node.js built-in test runner, Pug templates, highlight.js
- **Node.js Version**: Minimum 18+, CI tests on 18, 20, 22

## Build/Lint/Test Commands

```bash
npm run build          # Generate static HTML site (clears public/*.html first)
npm run dev            # Start dev server with live reload

npm test               # Run all tests
npm run test:unit      # Run unit tests only
npm run test:integration  # Run integration tests only

# Run a single test file
node --test tests/unit/extractCode.test.js

# Run specific test by name pattern
node --test --test-name-pattern="separates comments" tests/unit/extractCode.test.js

# Update snapshots after intentional changes
npm run test:update-snapshots
```

**Note**: This project does not use ESLint or Prettier. Follow the existing code style conventions below.

## Project Structure

```
nodejsByExample/
├── examples/           # Tutorial content - JS examples with comments
│   ├── contents.json   # Site navigation/structure configuration
│   └── [topic]/[n]/    # Numbered example sections (e.g., modern-js/1/)
├── tools/
│   ├── generate.js     # Static site generator (main build logic)
│   └── server.js       # Development server with live reload
├── templates/          # Pug templates for HTML generation
├── tests/
│   ├── unit/           # Unit tests for individual functions
│   ├── integration/    # Full build tests with snapshots
│   ├── fixtures/       # Test input data
│   └── snapshots/      # Expected HTML output
├── public/             # Generated HTML output (*.html gitignored)
└── docs/               # Project documentation
```

## Code Style Guidelines

### Module System
- Use ES Modules (`import`/`export`) - project has `"type": "module"` in package.json
- Always use `node:` prefix for built-in modules: `import fs from 'node:fs'`
- Include `.js` extension for local imports: `import { fn } from './module.js'`

### Import Order
```javascript
// 1. Node.js built-ins (with node: prefix)
import fs from 'node:fs';
import path from 'node:path';

// 2. Third-party packages
import pug from 'pug';

// 3. Local modules (with .js extension)
import { extractCode } from './extractCode.js';
```

### Naming Conventions
- **Functions/Variables**: camelCase (`extractCode`, `pageContents`)
- **Files**: camelCase for tools (`generate.js`), kebab-case for examples (`file-system.js`)
- **Directories**: kebab-case (`file-system/`, `http-server/`)

### Function Style
```javascript
// Prefer function declarations for exports
export function extractCode(content) {
  // ...
}

// Arrow functions for callbacks
items.map((item) => item.name);

// Async/await for asynchronous operations
async function readExamples() {
  const content = await readFile(filePath, 'utf8');
  return content;
}
```

### Error Handling
```javascript
try {
  const data = await readFile(filePath, 'utf8');
  return processData(data);
} catch (err) {
  console.error('Error reading file:', err.message);
  throw err;
}
```

### Formatting
- Double quotes for strings (`"string"`)
- 2-space indentation
- Semicolons optional (follow nearby code style)

## Testing Guidelines

Uses Node.js built-in test runner (`node:test`). No external test frameworks.

```javascript
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

describe('FeatureName', () => {
  it('should describe expected behavior', () => {
    const result = functionUnderTest(input);
    assert.strictEqual(result, expected);
  });

  it('handles edge case', () => {
    assert.deepStrictEqual(actualObject, expectedObject);
  });
});
```

- Place unit tests in `tests/unit/`, integration tests in `tests/integration/`
- Use fixtures from `tests/fixtures/` for test data
- Integration tests use snapshot comparison against `tests/snapshots/`

## Example Content Format

Examples in `examples/` follow a specific format that the generator parses:

```javascript
// Comments become tutorial text in the generated HTML
// You can use <b>HTML tags</b> in comments for formatting

const code = "This becomes highlighted code";

// Triple newlines separate sections


// This starts a new section
const nextSection = true;
```

- Each example topic has numbered subdirectories: `examples/topic/1/`, `examples/topic/2/`
- Each section contains a `.js` file and optionally a `.sh` file for shell commands
- Navigation structure defined in `examples/contents.json`

## Key Files Reference

| File | Purpose |
|------|---------|
| `tools/generate.js` | Main site generator - core build logic |
| `tools/server.js` | Development server with file watching |
| `examples/contents.json` | Site navigation and structure |
| `templates/*.pug` | HTML templates |

## CI/CD

- GitHub Actions runs tests on Node 18, 20, 22
- Static site deployed to GitHub Pages
- All tests must pass before merging

## Common Tasks

### Adding a New Example
1. Create directory: `examples/[topic]/1/`
2. Add `[topic].js` with commented tutorial content
3. Optionally add `[topic].sh` for shell commands
4. Update `examples/contents.json` with navigation entry
5. Run `npm run build` and `npm test` to verify

### Modifying the Generator
1. Edit `tools/generate.js`
2. Run `npm test` to check for regressions
3. If output changes intentionally, run `npm run test:update-snapshots`
