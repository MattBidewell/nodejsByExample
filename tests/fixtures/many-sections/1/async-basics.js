// <b>Async Programming</b> in JavaScript
// JavaScript is single-threaded but handles async operations efficiently
// using callbacks, promises, and async/await


// <b>Callbacks</b> - The traditional approach
// A callback is a function passed to another function
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { id: 1, name: 'Data' });
  }, 1000);
}


// Callback hell - nested callbacks become hard to read
// This pattern is why Promises were introduced
fetchData((err, data) => {
  if (err) return console.error(err);
  console.log(data);
  // More nested callbacks would go here...
});


// <b>Promises</b> - A cleaner approach
// Promises represent a value that may be available now, later, or never
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ id: 2, name: 'Promise Data' });
  }, 1000);
});


// Promise chaining eliminates callback hell
promise
  .then(data => {
    console.log('Received:', data);
    return data.id;
  })
  .then(id => {
    console.log('ID:', id);
  })
  .catch(err => {
    console.error('Error:', err);
  });
