import {ReflectionMethod} from "./ReflectionMethod";

/**
 * Provides useful information about a given function argument.
 */
export class ReflectionArgument
{
    /**
     * The definition of the argument, as it is written in the source code.
     */
    protected argument: {name: string, hasDefaultValue: boolean, value: any};

    /**
     * ReflectionArgument constructor.
     * 
     * @prop string The argument itself, as it is written in the source code.
     */
    constructor(argument: string)
    {
        const parsed = argument.split("=");
        this.argument = {
            name: parsed[0].trim(),
            hasDefaultValue: 1 < parsed.length,
            value: this.trimSpaces(parsed[1]),
        };
    }

    /**
     * Tells this argument's name.
     * 
     * @returns string
     */
    public name() : string
    {
        return this.argument.name;
    }

    /**
     * Tells if this argument has a default value or not.
     * 
     * @returns boolean
     */
    public hasDefaultValue() : boolean
    {
        return !! this.argument.hasDefaultValue;
    }

    /**
     * It returns the default value of the argument.
     */
    public defaultValue()
    {
        let value = this.argument.value;
        if (this.isNullOrUndefined(value))
            return this.sanitize(value);

        value = this.trimQuotes(value);

        if (this.isAnObject(value))
            value = eval(`(${value})`);

        return value;
    }

    /**
     * Transforms the string representations of "undefined" and "null" (the 
     * general empty values) to their respective, typesafe forms. If the value 
     * is anything but these two types, it will return it without modification.
     * 
     * @return undefined|null|any
     */
    protected sanitize(value) : undefined | null | any
    {
        if (value === "undefined")
            return undefined;

        if (value === "null")
            return null;

        return value;
    }

    /**
     * Checks if the given value is undefined, or null. Since it is possible 
     * that these values were declared explicitly, this also checks if these 
     * values are present as strings.
     * 
     * @returns boolean
     */
    protected isNullOrUndefined(value: string) : boolean
    {
        return ! value || value === "undefined" || value === "null";
    }

    /**
     * Checks if the passed (default) value is an object or not.
     * 
     * @returns boolean
     */
    protected isAnObject(value: string) : boolean
    {
        return value.startsWith('{');
    }

    /**
     * Trims the given value if it is not null or undefined. When it is, it 
     * returns any of those two, unprocessable values.
     * 
     * @param string value The value to sanitize.
     * 
     * @returns string The sanitized string, or the unprcessable primitives.
     */
    protected trimSpaces(value: string) : string
    {
        return value ? value.trim() : value;
    }

    /**
     * Removes the double- and single quotes from the beginning and the end of 
     * the given string.
     * 
     * @param string value The value to be trimmed.
     * 
     * @returns string
     */
    protected trimQuotes(value: string) : string
    {
        return value.replace(/^["']/, "").replace(/["']$/, "");
    }
}