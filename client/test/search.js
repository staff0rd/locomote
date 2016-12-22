import {expect, describe, it} from "chai";
const Client = require("./compiled");

describe("Search", () => {
    describe("validate", () => {
        it("should validate 'from'", () => {
            var search = new Client.Search("", "Sydney", "2018-01-01");

            search.validate();

            expect(search.isValid).to.be.false;
            expect(search.validationErrors).to.be.length(1);

            var message = search.validationErrors[0];

            expect(message).to.be.equal("From field not valid");
            expect(search.fromIsValid).to.be.false;
        });

        it("should validate 'to'", () => {
            var search = new Client.Search("Sydney", "", "2018-01-01");

            search.validate();

            expect(search.isValid).to.be.false;
            expect(search.validationErrors).to.be.length(1);

            var message = search.validationErrors[0];

            expect(message).to.be.equal("To field not valid");
            expect(search.toIsValid).to.be.false;
        });

        it("should validate empty 'date'", () => {
            var search = new Client.Search("Sydney", "Auckland", "");

            search.validate();

            expect(search.isValid).to.be.false;
            expect(search.validationErrors).to.be.length(1);

            var message = search.validationErrors[0];

            expect(message).to.be.equal("Date field not valid");
            expect(search.dateIsValid).to.be.false;
        });

        it("should validate invalid 'date'", () => {
            var search = new Client.Search("Sydney", "Auckland", "asdf");

            search.validate();

            expect(search.isValid).to.be.false;
            expect(search.validationErrors).to.be.length(1);

            var message = search.validationErrors[0];

            expect(message).to.be.equal("Date field not valid");
            expect(search.dateIsValid).to.be.false;
        });
    });
});
