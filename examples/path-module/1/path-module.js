// The <b>Path</b> module provides utilities for working with file and directory paths. It handles the differences between operating systems (Windows uses \, Unix uses /).


// Import specific functions from the path module
import { join, resolve, dirname, basename, extname, parse, format, normalize, isAbsolute, relative, sep } from 'node:path';


// <b>Joining Paths</b>
// join() combines path segments using the platform-specific separator. It normalizes the result.
const joined = join('users', 'documents', 'file.txt');
console.log('Joined:', joined);
// Unix: 'users/documents/file.txt'
// Windows: 'users\\documents\\file.txt'

// It handles ./ and ../ correctly
const normalized = join('users', '../admin', './config');
console.log('Normalized:', normalized); // 'admin/config'


// <b>Resolving Absolute Paths</b>
// resolve() creates an absolute path. It processes from right to left until an absolute path is formed.
const absolute = resolve('src', 'utils', 'helper.js');
console.log('Absolute:', absolute);
// Returns: /current/working/dir/src/utils/helper.js

// If you provide an absolute path, it uses that as the base
const fromRoot = resolve('/home', 'user', 'file.js');
console.log('From root:', fromRoot); // '/home/user/file.js'


// <b>Getting Directory Name</b>
// dirname() returns the directory portion of a path.
const dir = dirname('/users/admin/config.json');
console.log('Directory:', dir); // '/users/admin'

const parentDir = dirname(dirname('/a/b/c/file.txt'));
console.log('Grandparent:', parentDir); // '/a/b'


// <b>Getting File Name</b>
// basename() returns the last portion of a path. Optionally removes the extension.
const filename = basename('/path/to/file.txt');
console.log('Filename:', filename); // 'file.txt'

const nameOnly = basename('/path/to/file.txt', '.txt');
console.log('Name only:', nameOnly); // 'file'


// <b>Getting Extension</b>
// extname() returns the file extension, including the dot.
const ext = extname('report.pdf');
console.log('Extension:', ext); // '.pdf'

const noExt = extname('Makefile');
console.log('No extension:', noExt); // ''

const multiDot = extname('archive.tar.gz');
console.log('Multi-dot:', multiDot); // '.gz'


// <b>Parsing Paths</b>
// parse() breaks a path into its components: root, dir, base, ext, name.
const parsed = parse('/home/user/docs/report.pdf');
console.log('Parsed:', parsed);
// {
//   root: '/',
//   dir: '/home/user/docs',
//   base: 'report.pdf',
//   ext: '.pdf',
//   name: 'report'
// }


// <b>Formatting Paths</b>
// format() is the opposite of parse() - it builds a path from components.
const formatted = format({
  dir: '/home/user',
  name: 'config',
  ext: '.json'
});
console.log('Formatted:', formatted); // '/home/user/config.json'


// <b>Normalizing Paths</b>
// normalize() cleans up a path by resolving . and .. segments and removing redundant separators.
const messy = '/users//admin/../guest/./files';
console.log('Normalized:', normalize(messy)); // '/users/guest/files'


// <b>Checking Absolute Paths</b>
// isAbsolute() returns true if the path is absolute.
console.log('Is absolute /tmp:', isAbsolute('/tmp')); // true
console.log('Is absolute ./src:', isAbsolute('./src')); // false


// <b>Relative Paths</b>
// relative() calculates the relative path between two absolute paths.
const from = '/home/user/projects';
const to = '/home/user/documents/file.txt';
console.log('Relative:', relative(from, to)); // '../documents/file.txt'


// <b>Platform Separator</b>
// sep is the platform-specific path separator.
console.log('Separator:', sep); // '/' on Unix, '\\' on Windows
console.log('Split path:', '/a/b/c'.split(sep)); // ['', 'a', 'b', 'c']


// <b>Practical Example</b>
// Common pattern: get the directory of the current module and build paths from it.
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current file:', __filename);
console.log('Current dir:', __dirname);

// Build paths relative to current module
const configPath = join(__dirname, '..', 'config', 'settings.json');
console.log('Config path:', configPath);
