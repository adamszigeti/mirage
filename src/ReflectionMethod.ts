import {ReflectionArgument} from "./ReflectionArgument";

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

  public isConstructor() : boolean
  {
    return this._name === "constructor";
  }

  public arguments() : ReflectionArgument[]
  {
    let args = this.definition.match(this.matchingRule)[1];
    return this.purify(args.split(',')).map(arg => new ReflectionArgument(arg));
  }

  public invoke<T>(...params) : T
  {
    let args = params;
    if (params.length === 1 && params[0].constructor === Object) {
      let definedArgs = this.arguments().map(arg => arg.name());

      if (definedArgs.length === 1 && args[0][definedArgs[0]] === undefined)
        args = args;
      else 
        args = definedArgs.map(argument => params[0][argument]);
    }

    if (this.isConstructor())
      return new this.subject[this._name](...args);

    return this.subject[this._name](...args);
  }

  protected get definition() : string
  {
    return this.subject[this._name].toString();
  }

  protected get matchingRule() : RegExp
  {
    if (this.isConstructor())
      return /constructor.*\(([^)]*)\)/;

    return /^.+?\(([^)]*)\)/;
  }

  protected purify(args: string[]) : string[]
  {
    return args.map((arg: string) => arg.replace(/\/\*.*\*\//, '').trim())
      .filter((arg: string) => arg);
  }
}
