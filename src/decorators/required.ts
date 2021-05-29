import {ConstructorFunction} from "../entity-types";
import {forConstructor} from "../types-manager";

export function required() {
    return (target:any, property:string) => {
        const type = forConstructor(<ConstructorFunction>target.constructor);
        const field = type.ensureForField(property);
        field.required = true;

    }
}