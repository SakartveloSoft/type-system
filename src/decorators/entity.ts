import {ConstructorFunction, forConstructor} from "../types-manager";

export function entity(inherits?: string) {
    return (constructor:Function) => {
        let type = forConstructor(<ConstructorFunction>constructor);
        type.isEntity = true;
        type.inheritsFrom = inherits === undefined ? "entity" : inherits;
    }
}