// The <b>Fetch API</b> is built into Node.js for making HTTP requests. It's the same API used in browsers, making it easy to write isomorphic code.


// <b>Basic GET Request</b>
// fetch() returns a Promise that resolves to a Response object.
async function basicGet() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const data = await response.json();
  
  console.log('Status:', response.status);
  console.log('Data:', data);
}

basicGet();


// <b>Checking Response Status</b>
// Always check if the response was successful. fetch() doesn't throw on HTTP errors.
async function checkStatus() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}


// <b>POST Request with JSON Body</b>
// Send data by setting method, headers, and body.
async function postJson() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Hello',
      body: 'World',
      userId: 1
    })
  });
  
  const data = await response.json();
  console.log('Created:', data);
}


// <b>Other HTTP Methods</b>
// Use PUT, PATCH, DELETE the same way.
async function otherMethods() {
  // PUT - replace entire resource
  const putResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Updated', body: 'Content', userId: 1 })
  });
  
  // PATCH - partial update
  const patchResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Patched Title' })
  });
  
  // DELETE
  const deleteResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'DELETE'
  });
  
  console.log('Delete status:', deleteResponse.status);
}


// <b>Custom Headers</b>
// Set headers using a plain object or Headers instance.
async function customHeaders() {
  // Using object
  const response1 = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': 'Bearer token123',
      'X-Custom-Header': 'value'
    }
  });
  
  // Using Headers instance
  const headers = new Headers();
  headers.append('Authorization', 'Bearer token123');
  headers.append('Accept', 'application/json');
  
  const response2 = await fetch('https://api.example.com/data', { headers });
}


// <b>Reading Response Headers</b>
// Access response headers through the headers property.
async function readHeaders() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  
  console.log('Content-Type:', response.headers.get('content-type'));
  console.log('Date:', response.headers.get('date'));
  
  // Iterate all headers
  for (const [key, value] of response.headers) {
    console.log(`${key}: ${value}`);
  }
}


// <b>Different Response Types</b>
// Response provides methods for different data formats.
async function responseTypes() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  
  // JSON data
  // const json = await response.json();
  
  // Plain text
  // const text = await response.text();
  
  // Binary data as ArrayBuffer
  // const buffer = await response.arrayBuffer();
  
  // Binary data as Blob
  // const blob = await response.blob();
  
  // Note: You can only read the body once!
}


// <b>Timeout with AbortController</b>
// Use AbortController to set a timeout for requests.
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  }
}


// <b>Cancelling Requests</b>
// Cancel in-flight requests using AbortController.
async function cancellableRequest() {
  const controller = new AbortController();
  
  // Start the request
  const fetchPromise = fetch('https://jsonplaceholder.typicode.com/posts', {
    signal: controller.signal
  });
  
  // Cancel after 100ms
  setTimeout(() => {
    controller.abort();
    console.log('Request cancelled');
  }, 100);
  
  try {
    const response = await fetchPromise;
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Fetch was aborted');
    }
  }
}


// <b>Streaming Response Body</b>
// Read large responses as a stream.
async function streamResponse() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const text = decoder.decode(value, { stream: true });
    console.log('Received chunk:', text.length, 'bytes');
  }
}


// <b>Error Handling</b>
// Handle network errors and HTTP errors separately.
async function errorHandling() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    // Check for HTTP errors (4xx, 5xx)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (err) {
    // Network errors (no connection, DNS failure, etc.)
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
    } else {
      console.error('Error:', err.message);
    }
  }
}


// <b>Parallel Requests</b>
// Use Promise.all() to make multiple requests concurrently.
async function parallelRequests() {
  const urls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/posts/2',
    'https://jsonplaceholder.typicode.com/posts/3'
  ];
  
  const responses = await Promise.all(urls.map(url => fetch(url)));
  const data = await Promise.all(responses.map(r => r.json()));
  
  console.log('All posts:', data);
}


// <b>Retry Logic</b>
// Implement retry logic for unreliable endpoints.
async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      if (response.status >= 500 && attempt < maxRetries) {
        console.log(`Retry ${attempt}/${maxRetries} after server error`);
        await new Promise(r => setTimeout(r, delay * attempt));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.log(`Retry ${attempt}/${maxRetries} after error: ${err.message}`);
      await new Promise(r => setTimeout(r, delay * attempt));
    }
  }
}


// <b>Complete Example: API Client</b>
// A reusable API client wrapper.
class ApiClient {
  constructor(baseUrl, defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...options.headers
      }
    };
    
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

// Usage
const api = new ApiClient('https://jsonplaceholder.typicode.com');
api.get('/posts/1').then(console.log);
