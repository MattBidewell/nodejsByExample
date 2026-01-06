// <b>Parallel Async Operations</b>
// Running multiple async operations concurrently


// Promise.all() waits for all promises to resolve
// Great when operations are independent
async function fetchAllUsers() {
  const userIds = [1, 2, 3, 4, 5];
  
  const promises = userIds.map(id => 
    fetchUser(id)
  );
  
  const users = await Promise.all(promises);
  return users;
}


// Promise.allSettled() never rejects
// Returns status of each promise (fulfilled/rejected)
async function fetchWithStatus() {
  const promises = [
    Promise.resolve('Success 1'),
    Promise.reject(new Error('Failed')),
    Promise.resolve('Success 2')
  ];
  
  const results = await Promise.allSettled(promises);
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`Promise ${i}: ${result.value}`);
    } else {
      console.log(`Promise ${i} failed: ${result.reason.message}`);
    }
  });
}


// Promise.race() returns first settled promise
// Useful for timeouts
async function fetchWithTimeout(ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
  
  const data = fetchUser(1);
  
  return Promise.race([data, timeout]);
}


// Helper from previous example
async function fetchUser(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 100);
  });
}
