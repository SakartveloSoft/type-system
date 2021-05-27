import {ConstructorFunction, forConstructor} from "../types-manager";

export function hiddenFromClient() {
    return (target:any, property:string) => {
        const type = forConstructor(<ConstructorFunction>target.constructor);
        const field = type.ensureForField(property);
        field.hidden = true;
    }
}