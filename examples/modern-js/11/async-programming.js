//<b>Callbacks</b> are functions that are passed as arguments to other functions and are executed after some operation has been completed.
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received!");
  }, 2000);
}

fetchData((data) => {
  console.log(data); // Data received!
});


// <b>Promises</b> are objects representing the eventual completion or failure of an asynchronous operation. They are used to handle asynchronous operations in JavaScript.
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data received!");
    }, 2000);
  });
}

fetchData().then((data) => {
  console.log(data); // Data received!
});


//<b>Async/Await</b> is a new way to write asynchronous code in JavaScript. It makes asynchronous code look and behave more like synchronous code.
async function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data received!");
    }, 2000);
  });
}

async function main() {
  const data = await fetchData();
  console.log(data); // Data received!
}