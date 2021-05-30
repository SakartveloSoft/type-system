
export type ConstructorFunction = {new (...args:any[]):any;}

export type TypeClass<T> = { new () : T};

export enum DataFieldType {
    anyType = "anyType",
    string = "string",
    integer = "integer",
    float = "float",
    boolean = "boolean",
    dateTime = "dateTime",
    dateOnly = "dateOnly",
    fixedString = "fixedString",
    objectId = "objectId",
    array = "array",
    object = "object",
    text = "text",
    json = "json",
}

export interface IEntity {
    [name:string]:any;
}