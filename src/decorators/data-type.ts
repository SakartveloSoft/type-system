import {ConstructorFunction} from "../entity-types";
import {forConstructor} from "../types-manager";

export function dataType(dataType:string) {
    return function (constructor:ConstructorFunction) {
        let type = forConstructor(constructor);
        type.dataType = dataType;
    }
}