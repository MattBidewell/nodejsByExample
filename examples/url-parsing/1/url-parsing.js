// The <b>URL</b> class provides utilities for parsing, constructing, and manipulating URLs. It follows the WHATWG URL Standard, the same API used in browsers.


// <b>Parsing URLs</b>
// Create a URL object by passing a URL string. It parses all components automatically.
const url = new URL('https://user:pass@example.com:8080/path/to/page?search=test&page=1#section');

console.log('href:', url.href);           // Full URL
console.log('protocol:', url.protocol);   // 'https:'
console.log('username:', url.username);   // 'user'
console.log('password:', url.password);   // 'pass'
console.log('host:', url.host);           // 'example.com:8080'
console.log('hostname:', url.hostname);   // 'example.com'
console.log('port:', url.port);           // '8080'
console.log('pathname:', url.pathname);   // '/path/to/page'
console.log('search:', url.search);       // '?search=test&page=1'
console.log('hash:', url.hash);           // '#section'
console.log('origin:', url.origin);       // 'https://example.com:8080'


// <b>Relative URLs</b>
// Parse relative URLs by providing a base URL as the second argument.
const base = 'https://example.com/docs/guide/';
const relative = new URL('../api/users', base);
console.log('Resolved:', relative.href); // 'https://example.com/docs/api/users'

const absolute = new URL('/about', 'https://example.com/any/path');
console.log('Absolute path:', absolute.href); // 'https://example.com/about'


// <b>Query Parameters with URLSearchParams</b>
// The searchParams property provides a URLSearchParams object for working with query strings.
const apiUrl = new URL('https://api.example.com/search');

// Add parameters
apiUrl.searchParams.set('query', 'nodejs');
apiUrl.searchParams.set('page', '1');
apiUrl.searchParams.set('limit', '10');

console.log('With params:', apiUrl.href);
// 'https://api.example.com/search?query=nodejs&page=1&limit=10'


// <b>Reading Query Parameters</b>
// URLSearchParams provides methods to read query string values.
const searchUrl = new URL('https://example.com?name=Alice&tags=js&tags=node&active=true');
const params = searchUrl.searchParams;

// Get single value
console.log('name:', params.get('name')); // 'Alice'

// Get all values for a key (for repeated params)
console.log('tags:', params.getAll('tags')); // ['js', 'node']

// Check if parameter exists
console.log('has name:', params.has('name')); // true
console.log('has email:', params.has('email')); // false


// <b>Modifying Query Parameters</b>
// URLSearchParams is mutable - changes reflect in the URL.
const editUrl = new URL('https://example.com?page=1');

editUrl.searchParams.set('page', '2');        // Update existing
editUrl.searchParams.append('filter', 'new'); // Add new
editUrl.searchParams.append('filter', 'hot'); // Add another with same key
editUrl.searchParams.delete('page');          // Remove

console.log('Modified:', editUrl.search); // '?filter=new&filter=hot'


// <b>Iterating Query Parameters</b>
// URLSearchParams is iterable.
const iterUrl = new URL('https://example.com?a=1&b=2&c=3');

// Iterate entries
for (const [key, value] of iterUrl.searchParams) {
  console.log(`${key} = ${value}`);
}

// Get all keys
console.log('Keys:', [...iterUrl.searchParams.keys()]);

// Get all values
console.log('Values:', [...iterUrl.searchParams.values()]);

// Convert to object
const paramsObject = Object.fromEntries(iterUrl.searchParams);
console.log('As object:', paramsObject); // { a: '1', b: '2', c: '3' }


// <b>Sorting and Converting</b>
// Sort parameters alphabetically or convert to string.
const sortUrl = new URL('https://example.com?z=3&a=1&m=2');
sortUrl.searchParams.sort();
console.log('Sorted:', sortUrl.search); // '?a=1&m=2&z=3'

// Convert to string (for use in fetch, etc.)
const queryString = sortUrl.searchParams.toString();
console.log('String:', queryString); // 'a=1&m=2&z=3'


// <b>Creating URLs Programmatically</b>
// Build URLs by setting properties.
const newUrl = new URL('https://example.com');
newUrl.pathname = '/api/users';
newUrl.searchParams.set('role', 'admin');
newUrl.hash = 'top';

console.log('Built URL:', newUrl.href);
// 'https://example.com/api/users?role=admin#top'


// <b>URL Encoding</b>
// Special characters are automatically encoded.
const encoded = new URL('https://example.com/search');
encoded.searchParams.set('q', 'hello world & more');
console.log('Encoded:', encoded.href);
// 'https://example.com/search?q=hello+world+%26+more'

// Spaces become + in query strings, %20 in paths
const pathUrl = new URL('https://example.com');
pathUrl.pathname = '/path with spaces';
console.log('Path encoded:', pathUrl.pathname); // '/path%20with%20spaces'


// <b>URLSearchParams Standalone</b>
// Use URLSearchParams independently for parsing/building query strings.
const standalone = new URLSearchParams('name=Bob&age=30');
console.log('Parsed name:', standalone.get('name')); // 'Bob'

// Build from object
const fromObject = new URLSearchParams({ city: 'NYC', country: 'USA' });
console.log('From object:', fromObject.toString()); // 'city=NYC&country=USA'

// Build from array of pairs
const fromArray = new URLSearchParams([['x', '1'], ['y', '2']]);
console.log('From array:', fromArray.toString()); // 'x=1&y=2'


// <b>Validating URLs</b>
// Use URL.canParse() or try-catch to validate URLs.
console.log('Valid:', URL.canParse('https://example.com')); // true
console.log('Invalid:', URL.canParse('not a url')); // false

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}


// <b>Comparing URLs</b>
// Compare URLs by their href property.
const url1 = new URL('https://example.com/path?a=1&b=2');
const url2 = new URL('https://example.com/path?b=2&a=1');

console.log('Same href:', url1.href === url2.href); // false (different param order)

// Normalize for comparison
url1.searchParams.sort();
url2.searchParams.sort();
console.log('After sort:', url1.href === url2.href); // true


// <b>Practical Example: API URL Builder</b>
// A utility function for building API URLs.
function buildApiUrl(baseUrl, endpoint, params = {}) {
  const url = new URL(endpoint, baseUrl);
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  
  return url.href;
}

// Usage
const apiEndpoint = buildApiUrl(
  'https://api.example.com',
  '/v1/users',
  { role: 'admin', status: 'active', fields: ['name', 'email'] }
);
console.log('API URL:', apiEndpoint);
// 'https://api.example.com/v1/users?role=admin&status=active&fields=name&fields=email'
