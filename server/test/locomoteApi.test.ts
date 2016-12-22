import * as chai from "chai";
import * as mocha from "mocha";

import chaiHttp = require("chai-http");

import { LocomoteApi } from "../src/LocomoteApi";

chai.use(chaiHttp);
const expect = chai.expect;

describe("LocomoteApi", () => {

    describe("airlines", () => {
        it("should be a non-empty array", () => {
            return new LocomoteApi().getAirlines().then((result) => {
                expect(result).to.be.an("array");
                expect(result).to.have.length.greaterThan(1);

                const item = result[0];

                expect(item).to.have.keys("code", "name");
            });
        });
    });

    describe("airports", () => {
        it("should be a non-empty array", () => {
            return new LocomoteApi().getAirports("Melbourne").then((result) => {
                expect(result).to.be.an("array");
                expect(result).to.have.length.greaterThan(1);

                const item = result[0];

                expect(item).to.have.keys(
                    "airportCode",
                    "airportName",
                    "cityCode",
                    "cityName",
                    "countryCode",
                    "countryName",
                    "latitude",
                    "longitude",
                    "stateCode",
                    "timeZone",
                );
            });
        });
    });

    describe("search", () => {
        it("should be a non-empty array", () => {
            return new LocomoteApi().getFlightSearch("QF", "2018-09-02", "SYD", "JFK").then((result) => {
                expect(result).to.be.an("array");
                expect(result).to.have.length.greaterThan(1);

                const item = result[0];

                expect(item).to.have.keys(
                    "key",
                    "airline",
                    "flightNum",
                    "start",
                    "finish",
                    "plane",
                    "distance",
                    "durationMin",
                    "price",
                );
            });
        });
    });
});
