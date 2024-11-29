//<b>Primitives</b> refer to fundamental, immutable data types that are not objects. These include:


//<b>Strings</b>: A sequence of characters.
const name = 'NodeJSByExample';
console.log(typeof name); // string


//<b>Numbers</b>: Represents numeric values, both integers and floating-point numbers.
const age = 30;
console.log(typeof age); // number


//<b>BigInt</b>: Represents large integers that cannot be represented by the number type.
const bigInt = 9007199254740991n;
console.log(typeof bigInt); // bigint


//<b>Booleans</b>: Represents a logical value, either true or false.
const isNode = true;
console.log(typeof isNode); // boolean


//<b>Undefined</b>: Represents a variable that has been declared but not assigned a value.
const undefinedValue = undefined;
console.log(typeof undefinedValue); // undefined
let value;
console.log(typeof value); // undefined


//<b>Null</b>: Represents an intentional absence of any object value.
const nullValue = null;
console.log(typeof nullValue); // object
console.log(nullValue === null); // true


//<b>Symbols</b>: Represents a unique and immutable value that may be used as an object property key.
const symbol = Symbol('description');
console.log(typeof symbol); // symbol