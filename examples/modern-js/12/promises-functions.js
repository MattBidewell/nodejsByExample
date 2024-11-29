//<b>Promise.all</b> is a method that takes an array of promises and returns a single promise that resolves when all of the promises in the array have resolved.
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data 1");
  }, 2000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data 2");
  }, 1000);
});

Promise.all([promise1, promise2]).then((values) => {
  console.log(values); // ["Data 1", "Data 2"]
});


//<b>Promise.allSettled</b> is a method that takes an array of promises and returns a single promise that resolves when all of the promises in the array have settled (either resolved or rejected).
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data 3");
  }, 2000);
});

const promise4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("Error");
  }, 1000);
});

Promise.allSettled([promise3, promise4]).then((results) => {
  console.log(results); // [{ status: "fulfilled", value: "Data 3" }, { status: "rejected", reason: "Error" }]
});
