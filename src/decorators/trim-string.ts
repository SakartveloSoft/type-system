import {ConstructorFunction, forConstructor} from "../types-manager";
import {PreProcessorBuiltInId} from "../pre-processors";

export function trim() {
    return (target: any, property:string) => {
        const type = forConstructor(<ConstructorFunction>target.constructor);
        const field = type.ensureForField(property);
        field.addPreprocessor(PreProcessorBuiltInId.trim);
    }
}