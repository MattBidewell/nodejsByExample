// <b>Classes</b> are a template for creating objects, providing initial values for properties and methods.
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
}
