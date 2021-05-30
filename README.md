type-system

This package provides:
* set of the decorators for common aspects of data entities 
* services to build and validate the data entities

Applying these decorators does not provide the actual functionality for data persistence and other aspects.
This package intended to be a part of a broader ecosystem.

Your package must be a typescript with following `tsconfig.json` options to work seamless:
```json

```

Example of decoration, taken from tests (`app-user.ts`):
```typescript
import {dataType, defaultValue, entity, lowerCase, objectId, required, string, trim} from "../";

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

``` 

Example of usage from tests:
```typescript
import {createEmptyEntity, createEntity, forType, preprocessEntity, validateEntity} from "../";
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
        expect(cleanUser.status).equal(forType(User).fields.get('status').defaultValue);
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
});
```

Example of hidden values declaration:

```typescript
import {dataType, defaultValue, entity, lowerCase, objectId, required, string, trim, hiddenFromClient} from "../index";

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
    @hiddenFromClient()
    passwordHash:string;
    @hiddenFromClient()
    passwordSalt:string;
}
```
Example of hidden values exclusion from tests
```typescript
import {createEntity, excludeHiddenProperties} from "../";
import {User} from "./app-user";
import {expect} from 'chai'; 

describe('Check hidden fields', () => {
    it('Verify hidden fields excluded from client data', () => {
        let user = createEntity(User, {
            email:"Test@mail.example",
            name:"Some name to be tested ",
            passwordHash:"CRACK ME!",
            passwordSalt: "VERY SALTY!"
        }, true);
        let clientUser = excludeHiddenProperties(user);
        console.info(clientUser);
        expect(clientUser).not.haveOwnProperty('passwordHash');
        expect(clientUser).not.haveOwnProperty('passwordSalt');
    });
});
```
