export class ReflectionMethod
{
    protected _name: string;
    protected subject: Object;

    get name() : string { return this._name; }

    constructor(subject: Object, name: string)
    {
        this._name = name;
        this.subject = subject;
    }
}