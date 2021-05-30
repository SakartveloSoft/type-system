import {createEmptyEntity, createEntity, forType, preprocessEntity, validateEntity} from "../index";
import {expect} from "chai";
import {User} from "./app-user";
describe('Testing metadata for types', () => {
    it('registers a type for metadata', () => {

        let userType = forType(User);


        console.info({ dataType: userType.dataType, isEntity: userType.isEntity});
        expect(userType.isEntity).equal(true, 'User type must be marked as entity');
        for(let field of userType.fields.values()) {
            console.info(`field ${field.name}: ${field.type} is ${field.required ?"" : "not"} required`)
            expect(field.required).equal(true, "fields in test type must be marked as required");
        }
        expect(userType.dataType).equal("AppUser");

        let userObj = createEmptyEntity(User);
        userObj.email = "UpperCasedEmail@domain.com";
        userObj.name = "Some value to trim "
        let cleanUser = preprocessEntity(userObj);
        console.info(JSON.stringify(cleanUser));
        expect(cleanUser.status).equal(forType(User).fields.get('status')?.defaultValue);
        expect(cleanUser.email).equal(userObj.email.toLowerCase(), 'User email must be lower-cased');
        expect(cleanUser.name).equal(userObj.name.trim(), 'User name must be trimmed');
        
        
        let user2:User = createEntity(User, {
            name:"Long user name 2 ",
            email: "User2@Uper-case.com"
        }, true);
        console.info(user2);
        expect(user2.name).equal("Long user name 2 ".trim(), 'User 2 name must be trimmed');
        expect(user2.email).equal("User2@Uper-case.com".trim().toLowerCase(), 'User 2 name must be trimmed and lower-cased');
        expect(user2.id).a('string', 'ID must be a string').length(20, 'Expected generate id length is 20');
        

        validateEntity(User, user2);


        return true;
    })
})