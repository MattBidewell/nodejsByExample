// <b>ES Modules (ESM)</b> are the official JavaScript module system. Node.js fully supports ESM, providing modern import/export syntax.


// <b>Basic Imports</b>
// Import from Node.js built-in modules using node: prefix.
import fs from 'node:fs';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';


// <b>Named Exports</b>
// Export multiple values from a module.

// In math.js:
// export const PI = 3.14159;
// export function add(a, b) { return a + b; }
// export function multiply(a, b) { return a * b; }

// Import named exports
// import { PI, add, multiply } from './math.js';


// <b>Default Exports</b>
// Export a single main value from a module.

// In logger.js:
// export default class Logger {
//   log(msg) { console.log(msg); }
// }

// Import default export
// import Logger from './logger.js';


// <b>Mixed Exports</b>
// Combine default and named exports.

// In utils.js:
// export default function main() {}
// export const helper1 = () => {};
// export const helper2 = () => {};

// Import both
// import main, { helper1, helper2 } from './utils.js';


// <b>Renaming Imports</b>
// Use 'as' to rename imports and avoid conflicts.
import { readFile as read, writeFile as write } from 'node:fs/promises';
// import { helper as utilHelper } from './utils.js';


// <b>Namespace Imports</b>
// Import all exports as a single object.
import * as fsPromises from 'node:fs/promises';
// import * as utils from './utils.js';

console.log('Available fs methods:', Object.keys(fsPromises).slice(0, 5));


// <b>Re-exporting</b>
// Export from another module.

// In index.js (barrel file):
// export { add, multiply } from './math.js';
// export { default as Logger } from './logger.js';
// export * from './utils.js';


// <b>Dynamic Imports</b>
// Import modules at runtime with import().
async function loadModule(moduleName) {
  try {
    const module = await import(`node:${moduleName}`);
    console.log('Loaded module:', moduleName);
    return module;
  } catch (err) {
    console.error('Failed to load:', err.message);
  }
}

// Conditional loading
async function loadOptionalFeature() {
  if (process.env.ENABLE_FEATURE) {
    const { feature } = await import('./optional-feature.js');
    return feature;
  }
  return null;
}


// <b>import.meta</b>
// Access module metadata.
console.log('Current file URL:', import.meta.url);
console.log('Current directory:', import.meta.dirname);
console.log('Current filename:', import.meta.filename);

// Convert URL to path
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__filename:', __filename);
console.log('__dirname:', __dirname);


// <b>import.meta.resolve()</b>
// Resolve module specifiers to URLs.
const fsPath = import.meta.resolve('node:fs');
console.log('Resolved fs path:', fsPath);

// Resolve relative paths
// const localModule = import.meta.resolve('./local.js');


// <b>Top-Level Await</b>
// Use await at the module's top level.

// Fetch config at startup
// const config = await readFile('./config.json', 'utf8')
//   .then(JSON.parse)
//   .catch(() => ({}));

// Wait for async initialization
// await database.connect();

const startTime = await Promise.resolve(Date.now());
console.log('Module loaded at:', new Date(startTime).toISOString());


// <b>JSON Imports</b>
// Import JSON files with import assertions.
// import pkg from './package.json' with { type: 'json' };
// console.log('Package name:', pkg.name);


// <b>Conditional Exports (package.json)</b>
// Define different entry points for different conditions.
/*
{
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./utils": {
      "import": "./dist/esm/utils.js",
      "require": "./dist/cjs/utils.js"
    }
  }
}
*/


// <b>Subpath Exports</b>
// Export specific subpaths from a package.
/*
{
  "exports": {
    ".": "./index.js",
    "./feature": "./src/feature.js",
    "./utils/*": "./src/utils/*.js"
  }
}
*/

// Usage: import { feature } from 'my-package/feature';


// <b>Module Resolution</b>
// How Node.js finds modules.
// 1. Built-in modules: node:fs, node:path
// 2. Absolute paths: /home/user/module.js
// 3. Relative paths: ./module.js, ../module.js
// 4. Package names: lodash, express


// <b>ESM vs CommonJS Differences</b>
// Key differences to be aware of.

// ESM:
// - Static imports (hoisted, analyzed at parse time)
// - this is undefined at top level
// - No __filename, __dirname (use import.meta)
// - import/export syntax
// - .js extension required for relative imports

// CommonJS:
// - Dynamic requires (can be conditional)
// - this refers to module.exports
// - __filename, __dirname available
// - require/module.exports syntax
// - Extension optional


// <b>Interoperability with CommonJS</b>
// Import CommonJS modules from ESM.

// CJS module exports:
// module.exports = { hello: 'world' };
// module.exports = function() {};

// Import in ESM:
// import pkg from 'cjs-package';           // default import
// import { named } from 'cjs-package';     // may work if CJS exports object


// <b>Creating Dual Packages (ESM + CJS)</b>
// Support both module systems.
/*
{
  "name": "my-package",
  "type": "module",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/esm/index.js",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.cjs"
    }
  }
}
*/


// <b>Practical Example: Module Factory</b>
// Create configurable module exports.
function createAPI(config = {}) {
  const { baseURL = 'https://api.example.com', timeout = 5000 } = config;
  
  return {
    baseURL,
    timeout,
    
    async get(endpoint) {
      console.log(`GET ${baseURL}${endpoint}`);
      // Implementation here
    },
    
    async post(endpoint, data) {
      console.log(`POST ${baseURL}${endpoint}`, data);
      // Implementation here
    }
  };
}

// Export the factory
export { createAPI };

// Or export a configured instance
export const api = createAPI({ baseURL: 'https://myapi.com' });


// <b>Practical Example: Plugin System</b>
// Dynamic plugin loading with ESM.
async function loadPlugins(pluginPaths) {
  const plugins = [];
  
  for (const pluginPath of pluginPaths) {
    try {
      const plugin = await import(pluginPath);
      
      if (typeof plugin.default?.init === 'function') {
        await plugin.default.init();
        plugins.push(plugin.default);
        console.log(`Loaded plugin: ${pluginPath}`);
      }
    } catch (err) {
      console.error(`Failed to load plugin ${pluginPath}:`, err.message);
    }
  }
  
  return plugins;
}

// Usage:
// const plugins = await loadPlugins([
//   './plugins/auth.js',
//   './plugins/logging.js'
// ]);


// <b>Practical Example: Lazy Loading</b>
// Load heavy modules only when needed.
let heavyModule = null;

export async function processLargeData(data) {
  // Lazy load the heavy module
  if (!heavyModule) {
    console.log('Loading heavy module...');
    heavyModule = await import('node:zlib');
  }
  
  // Use the module
  return new Promise((resolve, reject) => {
    heavyModule.gzip(Buffer.from(JSON.stringify(data)), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}


// <b>Best Practices</b>
// 1. Always use .js extension for relative imports
// 2. Use node: prefix for built-in modules
// 3. Prefer named exports for better tree-shaking
// 4. Use barrel files (index.js) to simplify imports
// 5. Set "type": "module" in package.json for ESM
// 6. Use dynamic imports for optional/conditional modules
// 7. Leverage top-level await for async initialization
