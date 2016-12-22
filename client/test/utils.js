import {expect, describe, it} from "chai";
const Client = require("./compiled");

describe("Utils", () => {
    describe("getDuration", () => {
        it("should calculate minutes", () => {
            const result = Client.Utils.getDuration(56);

            expect(result).to.be.equal("56m");
        });

        it("should calculate hours", () => {
            const result = Client.Utils.getDuration(65);

            expect(result).to.be.equal("1h 5m");
        });

        it("should calculate days", () => {
            const result = Client.Utils.getDuration(1601);

            expect(result).to.be.equal("1d 2h 41m");
        });
    });
});
