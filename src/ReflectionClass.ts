export class ReflectionClass
{
    protected type;
    protected subject: Object;

    public constructor(subject: any)
    {
        this.type = subject;
        this.subject = subject instanceof Function ? new subject : subject;
    }

    public construct(...args) : Object
    {
        return new this.type(...args);
    }

    /**
     * Lists all the methods in the subject class.
     * 
     * @returns ReflectionMethod[]
     */
    public methods() : string[]
    {
        let methods = [];
        
        this.prototypes().forEach((prototype: Object) => {
            let object = new ReflectionClass(prototype);
            methods = methods.concat(object.members().filter((member: string) => {
                return prototype[member] instanceof Function;
            }));
        });

        return [...new Set(methods)];
    }

    /**
     * Lists all the properties of the subject class, without the methods.
     * 
     * @returns string[]
     */
    public properties() : string[]
    {
        return Object.getOwnPropertyNames(this.subject).filter((property: string) => {
            return ! (this.subject[property] instanceof Function);
        });
    }

    /**
     * Lists the properties, methods, and symbols in the subject class as an 
     * array of strings.
     * 
     * @returns string[]
     */
    public members() : string[]
    {
        let propsByProto = this.prototypes().map(prototype => {
            return Object.getOwnPropertyNames(prototype);
        });

        let allProps = propsByProto.reduce((prevProtoProps, nextProtoProps) => {
            return prevProtoProps.concat(nextProtoProps);
        });

        return [...new Set(allProps)];
    }

    /**
     * Lists all the prototypes of the subject, except for the Object prototype.
     * 
     * @returns Object[]
     */
    public prototypes() : Object[]
    {
        let prototype = this.subject;
        let collection = [prototype];
        while ((prototype = Object.getPrototypeOf(prototype)) && Object.getPrototypeOf(prototype)) {
            collection.push(prototype);
        }

        return collection;
    }
}