import {chai, assert} from "../TestCase";
import {ReflectionArgument} from "../../src/ReflectionArgument";

describe("ReflectionArgument", () => {
    describe(".name()", () => {
        it("Can give back the argument name", () => {
            let reflector = new ReflectionArgument("person = null");

            assert.equal(reflector.name(), "person");
        });
    });

    describe(".isOptional()", () => {
        it("Can determine if the argument is optional", () => {
            let required = new ReflectionArgument("person");
            let optional = new ReflectionArgument("person = null");

            assert.isTrue(optional.isOptional());
            assert.isFalse(required.isOptional());
        });
    });
});