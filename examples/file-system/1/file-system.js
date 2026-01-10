// The <b>File System</b> module (fs) provides APIs for interacting with the file system. Node.js offers both callback-based and promise-based APIs. We'll focus on the modern promises API.


// Import the promises API from the fs module. This provides async/await compatible functions.
import { readFile, writeFile, stat, mkdir, readdir, unlink, rename, copyFile, access, constants } from 'node:fs/promises';
import { existsSync } from 'node:fs';


// <b>Reading Files</b>
// readFile reads the entire contents of a file. Specify encoding to get a string, otherwise you get a Buffer.
async function readExample() {
  try {
    const content = await readFile('./example.txt', { encoding: 'utf8' });
    console.log('File contents:', content);
  } catch (err) {
    console.error('Error reading file:', err.message);
  }
}


// <b>Writing Files</b>
// writeFile creates a new file or overwrites an existing one. You can specify encoding and file mode.
async function writeExample() {
  const data = 'Hello, Node.js!\nThis is a test file.';
  
  await writeFile('./output.txt', data, { encoding: 'utf8' });
  console.log('File written successfully');
  
  // You can also write with specific flags
  await writeFile('./append.txt', 'New line\n', { flag: 'a' }); // 'a' appends
}


// <b>File Information</b>
// stat returns information about a file: size, timestamps, and whether it's a file or directory.
async function statExample() {
  const stats = await stat('./example.txt');
  
  console.log('Size:', stats.size, 'bytes');
  console.log('Created:', stats.birthtime);
  console.log('Modified:', stats.mtime);
  console.log('Is file:', stats.isFile());
  console.log('Is directory:', stats.isDirectory());
}


// <b>Checking File Existence</b>
// Use existsSync for simple existence checks, or access() for permission checks.
function checkExists() {
  // Synchronous check (simple but blocks)
  if (existsSync('./example.txt')) {
    console.log('File exists');
  }
}

async function checkAccess() {
  try {
    // Check if file is readable and writable
    await access('./example.txt', constants.R_OK | constants.W_OK);
    console.log('File is readable and writable');
  } catch {
    console.log('File is not accessible');
  }
}


// <b>Creating Directories</b>
// mkdir creates directories. Use recursive: true to create nested directories.
async function mkdirExample() {
  // Create a single directory
  await mkdir('./new-folder');
  
  // Create nested directories
  await mkdir('./path/to/nested/folder', { recursive: true });
  console.log('Directories created');
}


// <b>Reading Directories</b>
// readdir lists the contents of a directory. Use withFileTypes for more details.
async function readdirExample() {
  // Simple listing
  const files = await readdir('./');
  console.log('Files:', files);
  
  // With file type information
  const entries = await readdir('./', { withFileTypes: true });
  for (const entry of entries) {
    const type = entry.isDirectory() ? 'DIR' : 'FILE';
    console.log(`${type}: ${entry.name}`);
  }
}


// <b>Renaming and Moving Files</b>
// rename can rename or move files and directories.
async function renameExample() {
  await rename('./old-name.txt', './new-name.txt');
  console.log('File renamed');
  
  // Move to different directory
  await rename('./file.txt', './folder/file.txt');
}


// <b>Copying Files</b>
// copyFile creates a copy of a file.
async function copyExample() {
  await copyFile('./source.txt', './destination.txt');
  console.log('File copied');
  
  // With flags to prevent overwriting
  await copyFile('./source.txt', './dest.txt', constants.COPYFILE_EXCL);
}


// <b>Deleting Files</b>
// unlink removes files. For directories, use rmdir or rm with recursive option.
async function deleteExample() {
  await unlink('./file-to-delete.txt');
  console.log('File deleted');
}


// <b>Complete Example</b>
// Here's a practical example that combines multiple operations.
async function main() {
  const filename = './data.json';
  
  // Write JSON data
  const data = { name: 'Node.js', version: 24 };
  await writeFile(filename, JSON.stringify(data, null, 2));
  
  // Read it back
  const content = await readFile(filename, 'utf8');
  const parsed = JSON.parse(content);
  console.log('Read data:', parsed);
  
  // Get file info
  const info = await stat(filename);
  console.log('File size:', info.size, 'bytes');
  
  // Clean up
  await unlink(filename);
  console.log('Cleaned up');
}

main();
