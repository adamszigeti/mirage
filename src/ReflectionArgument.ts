import {ReflectionMethod} from "./ReflectionMethod";

export class ReflectionArgument
{
    protected argument: string;

    constructor(argument: string)
    {
        this.argument = argument;
    }

    public name() : string
    {
        return this.argument.split("=")[0].trim();
    }

    public isOptional() : boolean
    {
        return 1 < this.argument.split("=").length;
    }
}