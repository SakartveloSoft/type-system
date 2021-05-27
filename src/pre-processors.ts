export type PreprocessorFunction = (value:any) => any;
const preprocessorsMap = new Map<string, PreprocessorFunction>();

export enum PreProcessorBuiltInId {
    lowerCase = "lower-case",
    trim = "trim"
}

function trimFunc(value:any):string {
    return `${(value || '')}`.trim();
}

function lowerCase(value: any):string {
    return trimFunc(value).toLowerCase();
}
preprocessorsMap.set(PreProcessorBuiltInId.trim, trimFunc);
preprocessorsMap.set(PreProcessorBuiltInId.lowerCase, lowerCase);


export function resolveBuiltInPreprocessor(id: PreProcessorBuiltInId):PreprocessorFunction {
    return preprocessorsMap.get(id);
}