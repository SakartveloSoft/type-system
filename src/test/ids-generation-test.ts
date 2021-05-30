import {forType} from "../types-manager";
import {User} from "./app-user";
import {expect} from 'chai';

describe('Test object id generation', () => {
    it('Make sure of short-term iniquess of ids pack', () => {
        let userType = forType(User);

        let idsMap = new Map<string, boolean>();
        for(let x = 0; x < 100;x++) {
            let testId = userType.generateObjectId()
            console.info(`${testId.length} - ${testId}`);
            if (idsMap.has(testId)) {
                expect.fail(`Test id ${testId} already was generated`);
            }

        }

    })
})