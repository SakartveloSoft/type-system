import {ConstructorFunction, forConstructor} from "../types-manager";

export function defaultValue(value:any) {
    return (target:any, property:string) => {
        const type = forConstructor(<ConstructorFunction>target.constructor);
        const field = type.ensureForField(property);
        field.defaultValue = value;
    }
}