import * as chai from "chai";
import * as mocha from "mocha";

import chaiHttp = require("chai-http");

import app from "../src/App";

chai.use(chaiHttp);
const expect = chai.expect;

// describe("airlines", () => {

//   it("should be a non-empty array", () => {
//     return chai.request(app).get("/airlines")
//       .then(res => {
//         console.log("body", res.body);
//         expect(res.status).to.equal(200);
//         expect(res).to.be.json;
//         const item = res.body[0];

//         expect(item).to.have.property("code");
//         expect(item).to.have.property("name");
//       });
//   });
// });
