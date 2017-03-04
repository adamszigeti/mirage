import {chai, assert} from "../TestCase";
import {ReflectionMethod} from "../../src/ReflectionMethod";
import {ReflectionArgument} from "../../src/ReflectionArgument";

class Person
{
  public age: number;
  public name: string;

  constructor(name?: string, age?: number)
  {
    this.age = age;
    this.name = name;
  }

  greet(person: Person = null) {
    return `Hello ${person.name}, I am ${this.name}!`;
  }

  changeName(firstName: string, lastName: string) {
    this.name = `${firstName} ${lastName}`;
  }
}

function filterArgs(args: ReflectionArgument[], needle: string) : ReflectionArgument[] {
  return args.filter(arg => arg.name() === needle);
}

function assertArgumentsHas(args: ReflectionArgument[], needle: string) : void {
  assert.lengthOf(filterArgs(args, needle), 1);
}

describe("ReflectionMethod", () => {
  describe(".name()", () => {
    it("Can give back the method name", () => {
      let reflector = new ReflectionMethod(new Person, "constructor");

      assert.equal(reflector.name(), "constructor");
    });
  });

  describe(".arguments()", () => {
    it("Can give back the arguments of the function", () => {
      let reflector = new ReflectionMethod(new Person, "greet");

      let args = reflector.arguments();

      assert.lengthOf(args, 1);
      assertArgumentsHas(args, "person");
      assert.instanceOf(args[0], ReflectionArgument);
    });

    it("Can give back the arguments of the constructor", () => {
      let reflector = new ReflectionMethod(new Person, "constructor");

      let args = reflector.arguments();

      assert.lengthOf(args, 2);
      assertArgumentsHas(args, "age");
      assertArgumentsHas(args, "name");
      assert.instanceOf(args[0], ReflectionArgument);
      assert.instanceOf(args[1], ReflectionArgument);
    });
  });

  describe(".invoke()", () => {
    it("Can invoke a constructor with named parameters - without them being properly ordered", () => {
      let reflector = new ReflectionMethod(new Person, "constructor");

      let person = reflector.invoke<Person>({age: 21, name: "Adam Szigeti"});

      assert.equal(person.age, 21);
      assert.equal(person.name, "Adam Szigeti");
    });

    it("Can invoke a plain method with named parameters - without them being properly ordered", () => {
      let person = new Person("John Doe", 30);
      let reflector = new ReflectionMethod(person, "changeName");

      reflector.invoke({lastName: "Szigeti", firstName: "Adam"});

      assert.equal(person.name, "Adam Szigeti");
    });

    it("Can invoke a method when an object is a first and only parameter.", () => {
      class A {
        public something: Object;
        constructor(something?: Object) {
          this.something = something;
        }
      }

      let reflector = new ReflectionMethod(new A, "constructor");

      let param = {lastName: "Szigeti", firstName: "Adam"};
      let subject = reflector.invoke<A>(param);

      assert.deepEqual(subject.something, param);
    });

    it("Can return with the result of the method execution", () => {
      let person = new Person("John Doe", 30);
      let reflector = new ReflectionMethod(person, "greet");

      let greeting = reflector.invoke<string>({person: new Person("Jane Doe")});

      assert.equal(greeting, "Hello Jane Doe, I am John Doe!");
    });

    it("Can invoke method without an object of parameters being defined", () => {
      let person = new Person("John Doe", 30);
      let reflector = new ReflectionMethod(person, "changeName");
      let greetingsReflector = new ReflectionMethod(person, "greet");

      reflector.invoke("Adam", "Szigeti");
      let greeting = greetingsReflector.invoke<string>(new Person("Gertrude"));

      assert.equal(person.name, "Adam Szigeti");
      assert.equal(greeting, "Hello Gertrude, I am Adam Szigeti!");
    });
  });
});
