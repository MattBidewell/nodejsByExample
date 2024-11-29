//<b>Rest and Spread Operators</b> are two new operators introduced in ES6 that can be used to manipulate arrays and objects.
function printNumbers(...numbers) {
  for(const num of numbers) {
    console.log(num);
  }
}
printNumbers(1, 2, 3, 4, 5); // 1 2 3 4 5

const arr = [1, 2, 3];
const newArr = [...arr, 4, 5]; //  [1, 2, 3, 4, 5]

