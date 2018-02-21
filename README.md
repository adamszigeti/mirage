# Mirage
A simple, incomlete, yet powerful reflection library for JavaScript.

## 1. About

This is an experimental library to help me to discover the possibilitites of automatic Dependency Injection in JavaScript, similar to what you can find... well, basically in any other language. The conclusion of the experiment was that though it's somewhat possible to do so (with the combined strength of decorators and this library), it's really not a sensible thing to do in a production environment *this way*. I instead used a manual solution in my projects, which is much more performant in exchange for only a little more verbose initialization code at the toplevel.

This library mainly uses JavaScript's built-in features (among important custom solutions to extend their capabilities), and creates an abstraction layer which makes them easier to use, without external dependencies. Despite the experiment's results, this library is perfectly capable on it's own, and after some ironing it might be usable in production.

> **NOTE:** Though this library can already do the basic (and a couple of more involved) things, it's not ready for use in real projects yet!

## 2. Examples

In this section, all examples will use the following `Person` class to inspect:

```ts
class Person
{
    private number_of_pets: int = 1
    private first_name: string = "";
    private last_name: string = "";

    public constructor(first_name: string, last_name: string = "Smith", number_of_pets: int = 1)
    {
        this.first_name = first_name;
        this.last_name  = last_name;
        this.number_of_pets = number_of_pets;
    }

    public get name(): string
    {
        return `${this.first_name} ${this.last_name}`;
    }

    public greet(another: Person): string
    {
        return `Hello ${another.name}, I am ${this.name}!`;
    }

    public greetMany(persons: Person[]): string
    {
        return persons.reduce((result, individual) => `${result}\n${this.greet(individual)}`, "");
    }
}
```

### 2.1 Getting information about a class

`ReflectionClass` can give you detailed information about a type or an object. It will work either if you pass a function (a type) to it, or an already instantiated object. It's not complete, but the most essential functionalities are there, such as:

1. Getting names of all members in the class (methods, fields, and properties)
2. Getting only the fields of the class
3. Getting the methods of the class

What's left to do:

1. Getting only the properties of the class (`get` and `set`)
2. Renaming `.properties()` to `.fields()` to avoid confusion
3. Providing a way to get the current/default values of the fields through `Reflection*` classes (can be done manually by coding around this library, but it's... laughably inconvinient in the case of a reflection library)
4. Adding the ability to get only the symbols from a class.

Example:
```ts
// Creating the ReflectionClass object
const reflector = new ReflectionClass(Person);

// Getting all memebers of a given class.
const members: string[] = reflector.members(); // => "first_name", "last_name", "constructor", "name", "greet", "greetMany"

// Getting only the methods of a given class:
const methods: ReflectionMethod[] = reflector.methods(); // => "constructor", "greet", "greetMany"

// Getting only the properties of a given class (I should have named it "fields", really):
const properties: string[] = reflector.properties(); // => "first_name", "last_name", "number_of_pets"
```

### 2.2 Getting information about a class' or object's methods

Inspections can be done via the `ReflectionMethod` class, which accepts an already constructed object, and the name of the method to be inspected. The signature of the constructor is `ReflectionMethod(object, string);`.

**Current capabilities:**

1. Getting the name of the method
2. Getting the arguments of the method
3. Invoking the method
    * Invoking with regular parameter passing
    * Invoking with *named parameters*
    * Invoking without parameters
    * Returning the result of the method call

Example:
```ts
// Using Reflection class:
const reflector = new ReflectionClass(Person);
const constructor_method = reflector.methods()[0];

// ...or using it directly
const constructor_method = new ReflectionMethod(new Person, "constructor");

// Getting the name of the method:
const constructor_name: string = constructor_method.name(); // => "constructor"

// Getting the arguments of the method:
const constructor_arguments: ReflectionArgument[] = constructor_method.arguments() // => "first_name", "last_name", "number_of_pets"

// Invoking with no parameters:
const empty_person: Person = constructor_method.invoke<Person>(); // => An empty Person

// Invoking regularly, passing parameters in order:
const jane_doe: Person = constructor_method.invoke<Person>("Jane", "Doe");

// Invoking with named arguments, in arbitrary order:
const john_doe: Person = constructor_method.invoke<Person>({last_name: "Doe", first_name: "John"});

// Invoking a method, which accepts an object as the first and only parameter will work, despite
// the ability to use JS objects to achieve named parameters!
const johns_greeter_method = new ReflectionMethod(john_doe, "greet");
const greeting: string = greeter_method.invoke<string>(jane_doe); // => "Hello Jane Doe, I am John Doe!"

// ...so do arrays work properly, despite the varargs in which way the invoke() method is implemented...
const johns_greeter_method = new ReflectionMethod(john_doe, "greetMany");
const greeting: string = greeter_method.invoke<string>([jane_doe, john_doe]); // => "Hello Jane Doe, I am John Doe!\nHello John Doe, I am John Doe!"
```

But after seeing the above examples, you may be right to wonder about one other, special case when invoking methods: "What about when I have a plain `Object` which my method accepts (for example, as options), wouldn't this solution fail in that case?". I am happy to ensure you: it's working fine. The above example could not demonstrate this properly (for it's so out of context with persons), but here is another one:

```ts
interface HttpHeaders { [name: string]: string }

class HttpClient
{
    ...
    public async post(options: {headers: HttpHeaders, body: string}): Promise<Response>
    {
        return fetch(this.url, Object.merge(this.options, options));
    }
    ...
}

const post_method = new ReflectionMethod(new HttpClient, "post");

// The below invoke will execute just fine:
const response: Response = await post_method.invoke<Promise<Response>>({
    headers: {"content type": "application/json"},
    body: JSON.stringify({ hello: "world!" }),
});
```

### 2.3 Inspecting a method's argument

The `ReflectionArgument` can provide maximal insight to a method's given argument. Though this class' purpose is to work with `ReflectionMethod`, was designed for it, and that is the recommended way to use it, one can create a new instance by passing a string, representing a property like so: `new ReflectionArgument("number = 1.2");`.

What's done:

1. Getting the argument's name
2. Determining if the argument has a default value
3. Parsing the default value, and returning a typesafe-ish result

TODO:

1. Better value parsing, currently only `String`, `Number`, `null` and `undefined` is recognized.

Example:
```ts
// Creating a new ReflectionArgument:
const constructor_arguments = new ReflectionMethod(new Person, "constructor");

// Interacting with ReflectionMethod's arguments
constructor_arguments[0].name();            // => "first_name"
constructor_arguments[0].hasDefaultValue(); // => false
constructor_arguments[0].defaultValue();    // => undefined

constructor_arguments[1].name();            // => "last_name"
constructor_arguments[1].hasDefaultValue(); // => true
constructor_arguments[1].defaultValue();    // => "Smith"

constructor_arguments[2].name();            // => "number_of_pets"
constructor_arguments[2].hasDefaultValue(); // => true
constructor_arguments[2].defaultValue();    // => 1
```
