import {DataField, DataFieldType} from "./data-field";
import {IEntity} from "./entity-types";

export type ConstructorFunction = {new (...args:any[]):any;}
class TypeInfo {
    name:string;
    private readonly _constructor:ConstructorFunction;
    isEntity: boolean = false;
    inheritsFrom: string = null;
    dataType: string = "entity";
    built:boolean = false;
    fields: Map<string, DataField> = new Map<string, DataField>();
    constructor(name: string, constructor:ConstructorFunction) {
        this.name = name;
        this._constructor = constructor;
    }
    create(...args:any[]):any {
        return new (this._constructor)(...args);
    }
    createWithProperties<T>(properties:Partial<T>):T {
        let ret = new (this._constructor)();
        for(let prop of Object.keys(properties)) {
            ret[prop] = properties[prop];
        }
        return ret;
    }
    ensureForField(fieldName:string):DataField {
        let field = this.fields.get(fieldName);
        if (!field) {
            field = new DataField(fieldName, DataFieldType.anyType);
            this.fields.set(field.name, field);
        }
        return field;
    }
}
class TypesManager {
    private types: Map<string, TypeInfo> = new Map<string, TypeInfo>();

    getForType<T>(classObject:TypeClass<T>):TypeInfo {
        let type = this.types.get(classObject.name);
        if (!type) {
            type = new TypeInfo(classObject.name, classObject);
            this.types.set(type.name, type);
        }
        return type;
    }
    getForConstructor(constructor:ConstructorFunction):TypeInfo {
        let typeInfo = this.types.get(constructor.name);
        if (!typeInfo) {
            typeInfo = new TypeInfo(constructor.name, constructor);
            this.types.set(typeInfo.name, typeInfo);
        }
        return typeInfo;
    }
    preprocess<T>(entity:T, forCreation?:boolean):T {
        let type = this.getForConstructor(<ConstructorFunction>entity.constructor);
        for(let field of type.fields.values()) {
            if (!entity.hasOwnProperty(field.name) || entity[field.name] === null || entity[field.name] === undefined || entity[field.name] === '') {
                if (forCreation) {
                    if (field.defaultValue !== null && field.defaultValue !== undefined) {
                        entity[field.name] = field.defaultValue;
                    }
                } else {
                    continue;
                }
            }
            entity[field.name] = field.preprocess(entity[field.name]);
        }
        return entity;
    }
}

export const typesManager = new TypesManager();

export type TypeClass<T> = { new () : T};

export function forType<T>(typeClass:TypeClass<T>):TypeInfo {
    return typesManager.getForType(typeClass);
}
export function forConstructor(constructor:ConstructorFunction):TypeInfo {
    return typesManager.getForConstructor(constructor);
}

export function createEmptyEntity<T extends IEntity>(classRef:TypeClass<T>) :T {
    let type = forType(classRef);
    return typesManager.preprocess(type.create(), true);
}

export function createEntity<T extends IEntity>(classRef: TypeClass<T>, properties:Partial<T>) {
    let type = forType(classRef);
    return typesManager.preprocess(type.createWithProperties(properties));
}

export function preprocessEntity<T extends IEntity>(entity:T):T {
    return typesManager.preprocess(entity);
}