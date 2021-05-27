import {ConstructorFunction, forConstructor} from "../types-manager";
import {DataField, DataFieldType} from "../data-field";

function makeTypedFieldFunctor(fieldType:DataFieldType, fieldSetup?:((field:DataField) => void)) {
    return (target:any, property:string) => {
        const type = forConstructor(<ConstructorFunction>target.constructor);
        let field = type.ensureForField(property);
        field.type = fieldType;
        if (fieldSetup) {
            fieldSetup(field);
        }
    };
}
export function string() {
    return makeTypedFieldFunctor(DataFieldType.string);
}

export function integer() {
    return makeTypedFieldFunctor(DataFieldType.integer);
}

export function float() {
    return makeTypedFieldFunctor(DataFieldType.float);
}

export function boolean() {
    return makeTypedFieldFunctor(DataFieldType.boolean);
}

export function array() {
    return makeTypedFieldFunctor(DataFieldType.array);
}

export function dateTime() {
    return makeTypedFieldFunctor(DataFieldType.dateTime);
}

export function dateOnly() {
    return makeTypedFieldFunctor(DataFieldType.dateOnly);
}

export function fixedString(length:number) {
    return makeTypedFieldFunctor(DataFieldType.fixedString, field => {
        field.maxLength = length;
    });
}

export function text() {
    return makeTypedFieldFunctor(DataFieldType.text);
}

export function json() {
    return makeTypedFieldFunctor(DataFieldType.json);
}

export function objectId() {
    return makeTypedFieldFunctor(DataFieldType.objectId, field => {
        field.maxLength = 128;
    });
}



