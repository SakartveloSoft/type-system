import {PreProcessorBuiltInId, PreprocessorFunction, resolveBuiltInPreprocessor} from "./pre-processors";
import {DataFieldType} from "./entity-types";

export class DataField {
    public name: string;
    public type: DataFieldType = DataFieldType.anyType;
    maxLength: number = -1;
    required: boolean = false;
    hidden: boolean = false;
    preprocessors: PreprocessorFunction[] = [];
    defaultValue: any;
    haveKeywords: boolean = false;
    constructor(name:string, type: DataFieldType) {
        this.name = name;
        this.type = type;
    }
    addPreprocessor(id: PreProcessorBuiltInId) {
        let functor = resolveBuiltInPreprocessor(id);
        if (!this.preprocessors.includes(functor)) {
            this.preprocessors.push(functor);
        }
    }
    preprocess(value:any):any {
        if (this.preprocessors.length === 0) {
            return value;
        }
        for(let prep of this.preprocessors) {
            value = prep(value);
        }
        return value;
    }
}