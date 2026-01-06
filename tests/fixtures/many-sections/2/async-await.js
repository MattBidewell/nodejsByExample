// <b>Async/Await</b> - Modern async syntax
// async/await makes asynchronous code look synchronous


// The async keyword marks a function as asynchronous
// It always returns a Promise
async function getData() {
  return { id: 3, name: 'Async Data' };
}


// await pauses execution until the Promise resolves
// It can only be used inside async functions
async function fetchUser(id) {
  // Simulating an API call
  const response = await new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
    }, 500);
  });
  return response;
}


// Error handling with try/catch
// Much cleaner than .catch() chains
async function fetchWithErrorHandling() {
  try {
    const user = await fetchUser(1);
    console.log('User:', user);
    
    const profile = await fetchProfile(user.id);
    console.log('Profile:', profile);
  } catch (error) {
    console.error('Failed to fetch:', error.message);
  }
}


// Helper function for the example
async function fetchProfile(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ userId, bio: 'Developer', joined: '2023' });
    }, 300);
  });
}
