//<b>Optional Chaining</b> is a JavaScript feature that allows you to safely access nested properties of an object without worrying about whether the property exists or not.

const person = {
  name: "Alice",
};

console.log(person.job?.title); // undefined