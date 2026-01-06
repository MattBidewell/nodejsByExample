/**
 * Snapshot Update Helper
 * 
 * This script regenerates the snapshot files used for integration testing.
 * Run this when you make intentional changes to the generator output.
 * 
 * Usage: npm run test:update-snapshots
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSite } from '../../tools/generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures');
const SNAPSHOTS_DIR = path.join(__dirname, '..', 'snapshots');
const TEMPLATES_DIR = path.join(__dirname, '..', '..', 'templates');

// Ensure snapshots directory exists
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

console.log('Updating snapshots...');
console.log(`  Fixtures: ${FIXTURES_DIR}`);
console.log(`  Snapshots: ${SNAPSHOTS_DIR}`);
console.log(`  Templates: ${TEMPLATES_DIR}`);

// Run the generator with test fixtures, output directly to snapshots
buildSite({
  siteDir: SNAPSHOTS_DIR,
  templateDir: TEMPLATES_DIR,
  examplesDir: FIXTURES_DIR,
  contentsFile: path.join(FIXTURES_DIR, 'contents.json')
});

// List generated files
const generatedFiles = fs.readdirSync(SNAPSHOTS_DIR).filter(f => f.endsWith('.html'));
console.log('\nSnapshots updated successfully!');
console.log('Generated files:');
generatedFiles.forEach(file => console.log(`  - ${file}`));
