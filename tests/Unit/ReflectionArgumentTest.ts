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

        it("Returns 'null' if argument has null as default value", () => {
            let arg = new ReflectionArgument("person = null");

            assert.isNull(arg.defaultValue());
        });

        it("Returns a string without the apostrophes", () => {
            let arg1 = new ReflectionArgument(`person = "They say: \"Helga's voice is beautiful.\""`);
            let arg2 = new ReflectionArgument(`person = 'They say: "Helga's voice is beautiful."'`);

            assert.equal(arg1.defaultValue(), `They say: "Helga's voice is beautiful."`);
            assert.equal(arg2.defaultValue(), `They say: "Helga's voice is beautiful."`);
        });
    });
});