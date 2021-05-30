import {createEntity, excludeHiddenProperties} from "../types-manager";
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