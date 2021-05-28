import {forConstructor} from "../types-manager";

export function haveKeywords() {
    return(target:any, property: string) => {
        const type = forConstructor(target);
        const field = type.ensureForField(property);
        field.haveKeywords = true;
    }
}