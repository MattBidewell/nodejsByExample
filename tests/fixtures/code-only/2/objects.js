// <b>Objects</b> store key-value pairs
// Keys are strings (or Symbols), values can be anything
const person = {
  name: 'Alice',
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};


// Accessing properties
console.log(person.name);      // Alice
console.log(person['age']);    // 30
console.log(person.greet());   // Hello, I'm Alice


// Object destructuring extracts values
const { name, age } = person;
console.log(name, age); // Alice 30


// Spread operator copies and merges objects
const employee = {
  ...person,
  role: 'Developer',
  salary: 100000
};
