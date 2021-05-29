import {ConstructorFunction} from "../entity-types";
import {forConstructor} from "../types-manager";
import {PreProcessorBuiltInId} from "../pre-processors";

export function lowerCase() {
    return (target:any, property:string) => {
        const type = forConstructor(<ConstructorFunction>target.constructor);
        const field = type.ensureForField(property);
        field.addPreprocessor(PreProcessorBuiltInId.lowerCase);
    }
}