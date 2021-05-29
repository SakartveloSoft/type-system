import {ConstructorFunction} from "../entity-types";
import {forConstructor} from "../types-manager";

export function hiddenFromClient() {
    return (target:any, property:string) => {
        const type = forConstructor(<ConstructorFunction>target.constructor);
        const field = type.ensureForField(property);
        field.hidden = true;
    }
}