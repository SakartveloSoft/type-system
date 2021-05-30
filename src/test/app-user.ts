import {dataType, defaultValue, entity, lowerCase, objectId, required, string, trim} from "../decorators";

@entity()
@dataType('AppUser')
export class User {
    @objectId()
    @required()
    id: string;
    @string()
    @required()
    @lowerCase()
    email:string;
    @string()
    @required()
    @trim()
    name: string;
    @string()
    @required()
    @defaultValue('active')
    status:string;
}
