import {dataType, string, entity, required, objectId, trim, defaultValue, lowerCase} from "../decorators";
import {createEmptyEntity, createEntity, forType, preprocessEntity} from "../index";

describe('Testing metadata for types', () => {
    it('registers a type for metadata', () => {
        @entity()
        @dataType('AppUser')
        class User {
            @objectId()
            @required()
            id: string;
            @string()
            @required()
            @lowerCase()
            _email:string;
            @string()
            @required()
            @trim()
            name: string;
            @string()
            @required()
            @defaultValue('active')
            status:string;
        }

        let userType = forType(User);
        console.info({ dataType: userType.dataType, isEntity: userType.isEntity});
        for(let field of userType.fields.values()) {
            console.info(`field ${field.name}: ${field.type} is ${field.required ?"" : "not"} required`)
        }

        let userObj = createEmptyEntity(User);
        userObj._email = "UpperCasedEmail@domain.com";
        userObj.name = "Some value to trim "
        let cleanUser = preprocessEntity(userObj);
        console.info(JSON.stringify(cleanUser));

        let user2:User = createEntity(User, {
            name:"Long user name ",
            _email: "User-with@Uper-case.com"
        });
        console.info(user2);

        return true;
    })
})