import {DataField,} from "./data-field";
import {TypeClass, DataFieldType} from "./entity-types";
import {forType, TypeInfo} from "./types-manager";

export interface IValidationNotice {
    message: string;
    errorCode: string;
    expected?:any,
    current?:any
}

const knownValidationNotices = {
    required(field:DataField):IValidationNotice {
        return {
            message: `${field.name} is required`,
            errorCode: 'validation.field.required'
        };
    },
    typeMismatch(field:DataField, type:DataFieldType|string):IValidationNotice {
        return {
            message: `For ${field.name} a ${field.type} is expected`,
            errorCode: 'validation.field.typeMismatch',
            expected: field.type,
            current:type
        };
    },
    numericValueExpected(field:DataField):IValidationNotice {
        return {
            message: `For ${field.name} a numeric value expected`,
            errorCode: 'validation.field.numericExpected',
            expected:'number',
            current: 'NaN'
        }
    },
    integerValueExpected(field:DataField):IValidationNotice {
        return {
            message: `For ${field.name} an integer value expected`,
            errorCode: 'validation.field.integerExpected',
            expected: 'integer',
            current: 'number with decimals'
        }
    },
    valueTooLong(field:DataField, valueLength?:number):IValidationNotice {
        return {
            message: `For ${field.name} too long value was provided`,
            errorCode: 'validation.field.valueTooLong',
            expected: field.maxLength,
            current: valueLength
        };
    }
}

let validationFunctors:{[fieldType:string]:(field:DataField, value:any) => IValidationNotice } = {
    [DataFieldType.string]:(field, value) => {
        if (typeof(value) !== "string") {
            return knownValidationNotices.typeMismatch(field, typeof(value));
        }
    },
    [DataFieldType.boolean]:(field, value) => {
        if (typeof(value) !== "boolean") {
            return knownValidationNotices.typeMismatch(field, typeof(value));
        }
    },
    [DataFieldType.float]:(field, value) => {
        if (typeof(value) !== 'number') {
            return knownValidationNotices.typeMismatch(field, typeof(value));
        }
        if (isNaN(value)) {
            return knownValidationNotices.numericValueExpected(field);
        }
    },
    [DataFieldType.integer]:(field, value) => {
        let notice = validationFunctors[DataFieldType.float](field, value);
        if (!notice && (Math.floor(value) !== value)) {
            notice = knownValidationNotices.integerValueExpected(field);
        }
        return notice;
    },
    [DataFieldType.fixedString]:(field, value) => {
        let notice = validationFunctors[DataFieldType.string](field, value);
        if (!notice && field.maxLength > 0) {
            if (value.length > field.maxLength) {
                notice = knownValidationNotices.valueTooLong(field, value.length);
            }
        }
        return notice;
    },
    [DataFieldType.array]:(field,value) => {
        if (!Array.isArray(value)) {
            return knownValidationNotices.typeMismatch(field, 'array');
        }
    },
    [DataFieldType.text]:(field, value) => {
        return validationFunctors[DataFieldType.string](field, value);
    },
    [DataFieldType.dateTime]:(field, value:any) => {
        if (value instanceof Date) {
            return null;
        }
        if (typeof(value) === 'string') {
            try {
                let parsed = new Date(value);
                let time = parsed.getTime();
                if (!isNaN(time)) {
                    return null;
                }
            } catch (e) {
                //we can not do anything special here, returning validation error can be enough
            }
        }
        return knownValidationNotices.typeMismatch(field, 'date');
    },
    [DataFieldType.dateOnly]:(field, value) => {
        return validationFunctors[DataFieldType.dateTime](field, value);
    }

}

export function validateFieldValue(field:DataField, value: any):IValidationNotice {
    if (value === undefined || value === null || value === '') {
        if (field.required) {
            return knownValidationNotices.required(field);
        } else {
            return null;
        }
    }
    if (field.type !== DataFieldType.anyType) {
        let typeValidator = validationFunctors[field.type];
        if (typeValidator) {
            let validationNotice = typeValidator(field, value);
            if (validationNotice) {
                return validationNotice;
            }
        }

    }


}

export class ValidationError extends Error{
    public readonly type: TypeInfo;
    public readonly errors: IValidationNotice[];
    constructor(message:string, type?:TypeInfo, ...validationNotices:IValidationNotice[]) {
        super(message);
        this.type = type;
        this.errors = validationNotices;
    }
}

export function validateEntity<T>(classRef:TypeClass<T>,  entity:T, noThrow?:boolean):ValidationError {
    let type = forType(classRef);
    let validationNotices: IValidationNotice[] = [];
    for(let field of type.fields.values()) {
        let value = entity[field.name];
        let validationNotice = validateFieldValue(field, value);
        if (validationNotice) {
            validationNotices.push(validationNotice);
        }
    }
    if (validationNotices.length > 0) {
        if (noThrow) {
            return new ValidationError("Entity validation failed", type, ...validationNotices);
        } else {
            throw new ValidationError("Entity validation failed", type, ...validationNotices);
        }
    }
}