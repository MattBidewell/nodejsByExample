// <b>Arrays</b> are ordered collections of values
// They can hold any type of data
const numbers = [1, 2, 3, 4, 5];
const mixed = ['hello', 42, true, null];


// Array methods are powerful tools
// map() transforms each element
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]


// filter() selects elements matching a condition
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]


// reduce() combines elements into a single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15
