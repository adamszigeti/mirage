import {chai, assert} from "../TestCase";
import {ReflectionClass} from "../../src/ReflectionClass";

class Subject
{
    public property: string = "Cuccli";
    public property_2: number = 1234;

    public constructor() {}
    public doSomethingFunny() {}
}

class SubSubject extends Subject
{
    public property_3: boolean = true;
    public doAnotherThing() {}
}

class Person
{
    public age: number;
    public name: string;

    constructor(name: string, age: number)
    {
        this.age = age;
        this.name = name;
    }
}

describe("ReflectionClass", () => {
    describe(".construct()", () => {
        it("Can construct a class with required arguments", () => {
            let reflector = new ReflectionClass(Person);

            let person = reflector.construct("Adam", 23) as Person;

            assert.equal(person.age, 23);
            assert.equal(person.name, "Adam");
            assert.instanceOf(person, Person);
        });
        
        it("Can construct a class without the required arguments", () => {
            let reflector = new ReflectionClass(Person);

            let person = reflector.construct() as Person;

            assert.equal(person.age, undefined);
            assert.equal(person.name, undefined);
            assert.instanceOf(person, Person);
        });
    });

    describe(".methods()", () => {
        it("Lists methods written in ES6", () => {
            let reflector = new ReflectionClass(Subject);
            
            let methods = reflector.methods();

            assert.lengthOf(methods, 2);
            assert.include(methods, "constructor");
            assert.include(methods, "doSomethingFunny");
        });

        it("Lists ES6 sub- and parent class' methods as well", () => {
            let reflector = new ReflectionClass(SubSubject);
            
            let methods = reflector.methods();

            assert.lengthOf(methods, 3);
            assert.include(methods, "doAnotherThing");
        });

        it("Lists a traditional object's methods", () => {
            let reflector = new ReflectionClass({
                arrowSyntax: () => {},
                classic: function () {},
                newMethodDeclaration() {},
            });

            let methods = reflector.methods();

            assert.lengthOf(methods, 3);
            assert.include(methods, "classic");
            assert.include(methods, "arrowSyntax");
            assert.include(methods, "newMethodDeclaration");
        });

        it("Won't list getters and setters", () => {
            let reflector = new ReflectionClass({
                get name() { return "Cucc"; },
                set name(value) { this._name = value; }
            });

            let methods = reflector.methods();

            assert.lengthOf(methods, 0);
        });

        it("won't show properties", () => {
            let reflector = new ReflectionClass({
                name: "Cucc", age: 21
            });

            let methods = reflector.methods();

            assert.lengthOf(methods, 0);
        });

        it("Won't show prototype overwrites as duplicate elements", () => {
            class TestSubject extends Subject {
                doSomethingFunny() {}
                toString() { return ""; }
            }
            let reflector = new ReflectionClass(TestSubject);

            let methods = reflector.methods();

            assert.lengthOf(methods, 3);
        });

        it("It lists constructor as a method", () => {
            let reflector = new ReflectionClass(class ToBeConstructed {
                constructor() { }
            });

            let methods = reflector.methods();

            assert.lengthOf(methods, 1);
        });
    });

    describe(".properties()", () => {
        it("Lists all the properties of a classic object", () => {
            let reflector = new ReflectionClass({
                prop2: 1,
                prop1: "",
                prop3: {},
            });

            let properties = reflector.properties();

            assert.lengthOf(properties, 3);
        });

        it("Lists all the properties of an ES6 object", () => {
            let reflector = new ReflectionClass(Subject);

            let properties = reflector.properties();

            assert.lengthOf(properties, 2);
        });

        it("Lists all the properties from the parent class as well", () => {
            let reflector = new ReflectionClass(SubSubject);

            let properties = reflector.properties();

            assert.lengthOf(properties, 3);
        });

        it("Won't list methods, or function types", () => {
            let reflector = new ReflectionClass({
                prop1() {},
                pro2: () => {},
                prop3: function () {},
            });

            let properties = reflector.properties();

            assert.lengthOf(properties, 0);
        });
    });

    describe(".members()", () => {
        it("Lists the properties and the methods of a classic object", () => {
            let reflector = new ReflectionClass({
                name: "Pista", age: 21,
                greet(person) {
                    return `Hello, ${person.name}!`;
                }
            });

            let members = reflector.members();

            assert.lengthOf(members, 3);
        });

        it("Lists the properties and the methods of an ES6 object", () => {
            let reflector = new ReflectionClass(Subject);

            let members = reflector.members();

            assert.lengthOf(members, 4);
        });

        it("Lists the parent class' methods and properties as well", () => {
            let reflector = new ReflectionClass(SubSubject);

            let members = reflector.members();

            assert.lengthOf(members, 6);
        });
    });

    describe(".prototypes()", () => {
        it("Lists all the prototypes of an inherited ES6 class", () => {
            let reflector = new ReflectionClass(SubSubject);

            let prototypes = reflector.prototypes();

            assert.lengthOf(prototypes, 3);
        });

        it("Lists all the prototypes of an inherited classic class", () => {
            function A(name) {
                this.name = name;
            }

            function B(name, age) {
                A.call(this, name);
                this.age = age;
            }

            let reflector = new ReflectionClass(B);

            let prototypes = reflector.prototypes();

            assert.lengthOf(prototypes, 2);
        });
    });
});