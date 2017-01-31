export class ReflectionMethod
{
    protected _name: string;
    protected subject: Object;

    constructor(subject: Object, name: string)
    {
        this._name = name;
        this.subject = subject;
    }

    public name() : string
    {
        return this._name;
    }
}