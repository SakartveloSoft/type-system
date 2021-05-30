import {DataField} from "./data-field";
import {DataFieldType, ConstructorFunction, IEntity, TypeClass} from "./entity-types";
import {randomBytes} from "crypto";
export class TypeInfo {
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
    generateObjectId():string {
        let bytes = randomBytes(16);
        let uint32Values = new Uint32Array(bytes.buffer, 0);
        return `${uint32Values[0].toString(36)}${uint32Values[1].toString(36)}${uint32Values[2].toString(36)}${uint32Values[3].toString(36)}`.substr(0, 20);
    }
    create(...args:any[]):any {
        return new (this._constructor)(...args);
    }
    createWithProperties<T>(properties:Partial<T>, produceId?:boolean):T {
        let ret = new (this._constructor)();
        for(let prop of Object.keys(properties)) {
            ret[prop] = properties[prop];
        }
        if (ret.id === undefined && produceId) {
            ret.id = this.generateObjectId();
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
    excludeHiddenData<T>(entity:T):Partial<T> {
        let type = this.getForConstructor(<ConstructorFunction>entity.constructor);
        let result:Partial<T> = {};
        for(let prop of type.fields.values()) {
            if (!prop.hidden) {
                result[prop.name] = entity[prop.name];
            }
        }
        return result;
    }
}

export const typesManager = new TypesManager();


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

export function generateObjectId<T extends IEntity>(classRef:TypeClass<T>):string {
    return forType(classRef).generateObjectId();
}

export function createEntity<T extends IEntity>(classRef: TypeClass<T>, properties:Partial<T>, produceId?:boolean) {
    let type = forType(classRef);
    return typesManager.preprocess(type.createWithProperties(properties, produceId), true);
}

export function preprocessEntity<T extends IEntity>(entity:T):T {
    return typesManager.preprocess(entity);
}

export function excludeHiddenProperties<T extends IEntity>(entity:T):Partial<T> {
    return typesManager.excludeHiddenData(entity);
}