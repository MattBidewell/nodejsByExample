//<b>Nullish coalescing</b> is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.

const name = null;
const defaultName = "Guest";

console.log(name ?? defaultName); // Guest