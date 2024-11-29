//<b>Functions</b> are blocks of code that can be called to perform a specific task. In JavaScript, functions are first-class objects, which means they can be passed around like any other value.

function helloWorld() {
  console.log("Hello, World!");
}


// <b>Arrow functions</b>, a concise syntax for writing functions:
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5


//<b>IIFE (Immediately Invoked Function Expression)</b> is a function that is executed immediately after it is created.
(function() {
  console.log("I am IIFE");
})(); // IIFE