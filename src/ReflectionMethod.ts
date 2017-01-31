export class ReflectionMethod
{
    protected method: string;
    protected subject: Object;

    constructor(subject: Object, method: string)
    {
        this.method = method;
        this.subject = subject;
    }

    
}