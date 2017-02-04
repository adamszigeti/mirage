import {ReflectionMethod} from "./ReflectionMethod";

/**
 * Provides useful information about a given function argument.
 */
export class ReflectionArgument
{
    /**
     * The definition of the argument, as it is written in the source code.
     */
    protected argument: string;

    /**
     * ReflectionArgument constructor.
     * 
     * @prop string The argument itself, as it is written in the source code.
     */
    constructor(argument: string)
    {
        this.argument = argument;
    }

    /**
     * Tells this argument's name.
     * 
     * @returns string
     */
    public name() : string
    {
        return this.argument.split("=")[0].trim();
    }

    /**
     * Tells if this argument has a default value or not.
     * 
     * @returns boolean
     */
    public hasDefaultValue() : boolean
    {
        return 1 < this.argument.split("=").length;
    }

    /**
     * It returns the default value of the argument.
     */
    public defaultValue()
    {
        let value = this.argument.split("=")[1];

        value = value ? value.trim() : value;
        if (! value || value === "undefined")
            return undefined;

        if (value === "null")
            return null;

        value = value.replace(/^["']/, "").replace(/["']$/, "");

        if (value.startsWith('{'))
            value = eval(`(${value})`);

        return value;
    }
}