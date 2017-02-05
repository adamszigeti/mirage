import {chai, assert} from "../TestCase";
import {ReflectionArgument} from "../../src/ReflectionArgument";

describe("ReflectionArgument", () => {
    describe(".name()", () => {
        it("Can give back the argument name", () => {
            let reflector = new ReflectionArgument("person = null");

            assert.equal(reflector.name(), "person");
        });
    });

    describe(".hasDefaultValue()", () => {
        it("Can determine if the argument is optional", () => {
            let required = new ReflectionArgument("person");
            let optional = new ReflectionArgument("person = null");

            assert.isTrue(optional.hasDefaultValue());
            assert.isFalse(required.hasDefaultValue());
        });
    });

    describe(".defaultValue()", () => {
        it("Returns 'undefined' if argument has no default value", () => {
            let arg = new ReflectionArgument("person");

            assert.isUndefined(arg.defaultValue());
        });

        it("Returns 'undefined' if argument's default value is explicitly 'undefined'", () => {
            let arg = new ReflectionArgument("person = undefined");

            assert.isUndefined(arg.defaultValue());
        });

        it("Returns 'undefined' as a string when specified as a stirng", () => {
            let arg = new ReflectionArgument("person = 'undefined'");

            assert.equal(arg.defaultValue(), "undefined");
        });

        it("Returns 'null' if argument has null as default value", () => {
            let arg = new ReflectionArgument("person = null");

            assert.isNull(arg.defaultValue());
        });

        it("Returns 'null' as string when specified as such", () => {
            let arg = new ReflectionArgument("person = 'null'");

            assert.equal(arg.defaultValue(), "null");
        });

        it("Returns a string without the apostrophes", () => {
            let arg1 = new ReflectionArgument(`person = "They say: \"Helga's voice was beautiful.\""`);
            let arg2 = new ReflectionArgument(`person = 'They say: "Helga's voice was beautiful."'`);

            assert.equal(arg1.defaultValue(), `They say: "Helga's voice was beautiful."`);
            assert.equal(arg2.defaultValue(), `They say: "Helga's voice was beautiful."`);
        });

        it("Returns a number as a number", () => {
            let float = new ReflectionArgument(`person = 1.2`);
            let integer = new ReflectionArgument(`person = '200`);

            assert.equal(float.defaultValue(), 1.2);
            assert.equal(integer.defaultValue(), 200);
        });

        it("Returns an object as an object", () => {
            let argument = new ReflectionArgument(`person = {name:'Adam'}`);

            let value = argument.defaultValue();

            assert.instanceOf(value, Object);
            assert.propertyVal(value, "name", "Adam");
        });
    });
});