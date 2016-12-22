(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const Airlines_1 = require("./routes/Airlines");
const Airports_1 = require("./routes/Airports");
const Search_1 = require("./routes/Search");
const corsOptions = {
    optionsSuccessStatus: 200,
    origin: "http://lvh.me:9000",
};
class App {
    constructor() {
        this.express = express();
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        this.express.use(cors(corsOptions));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    configureRoutes() {
        this.express.use("/airlines", Airlines_1.default);
        this.express.use("/airports", Airports_1.default);
        this.express.use("/search", Search_1.default);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new App().express;

},{"./routes/Airlines":4,"./routes/Airports":5,"./routes/Search":7,"body-parser":undefined,"cors":undefined,"express":undefined}],2:[function(require,module,exports){
"use strict";
const request = require("request");
const endPoints = {
    airlines: "http://node.locomote.com/code-task/airlines",
    airports: "http://node.locomote.com/code-task/airports",
    flight_search: "http://node.locomote.com/code-task/flight_search",
};
class LocomoteApi {
    getAirlines() {
        return this.getRequest(endPoints.airlines);
    }
    getAirports(query) {
        return this.getRequest(`${endPoints.airports}?q=${query}`);
    }
    getFlightSearch(airlineCode, date, from, to) {
        return this.getRequest(`${endPoints.flight_search}/${airlineCode}?date=${date}&from=${from}&to=${to}`);
    }
    getRequest(endPoint) {
        console.log("GET: " + endPoint);
        return new Promise((resolve, reject) => {
            request(endPoint, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(JSON.parse(body));
                }
                else {
                    console.error(`${response.statusCode}: ${body}`);
                    reject(body);
                }
            });
        });
    }
}
exports.LocomoteApi = LocomoteApi;

},{"request":undefined}],3:[function(require,module,exports){
"use strict";
const http = require("http");
const App_1 = require("./App");
const port = normalizePort(process.env.PORT || 3000);
App_1.default.set("port", port);
const server = http.createServer(App_1.default);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
function normalizePort(val) {
    // tslint:disable:no-shadowed-variable
    let port = (typeof val === "string") ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    }
    else if (port >= 0) {
        return port;
    }
    else {
        return false;
    }
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    let bind = (typeof port === "string") ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    let addr = server.address();
    let bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}

},{"./App":1,"http":undefined}],4:[function(require,module,exports){
"use strict";
const BaseRouter_1 = require("./BaseRouter");
class Airlines extends BaseRouter_1.BaseRouter {
    init() {
        this.router.get("/", (req, res) => this.getAll(req, res));
    }
    getAll(req, res) {
        this.sendResponse(this.api.getAirlines(), res);
    }
}
exports.Airlines = Airlines;
const routes = new Airlines();
routes.init();
const router = routes.router;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;

},{"./BaseRouter":6}],5:[function(require,module,exports){
"use strict";
const BaseRouter_1 = require("./BaseRouter");
class Airports extends BaseRouter_1.BaseRouter {
    init() {
        this.router.get("/:query", (req, res) => this.getAll(req, res));
    }
    getAll(req, res) {
        this.sendResponse(this.api.getAirports(req.params.query), res);
    }
}
exports.Airports = Airports;
const routes = new Airports();
routes.init();
const router = routes.router;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;

},{"./BaseRouter":6}],6:[function(require,module,exports){
"use strict";
const express_1 = require("express");
const LocomoteApi_1 = require("../LocomoteApi");
class BaseRouter {
    constructor() {
        this.api = new LocomoteApi_1.LocomoteApi();
        this.router = express_1.Router();
        this.init();
    }
    sendResponse(promise, res) {
        promise.then((result) => {
            res.json(result);
        }).catch((error) => {
            res.send(500, error);
        });
    }
}
exports.BaseRouter = BaseRouter;

},{"../LocomoteApi":2,"express":undefined}],7:[function(require,module,exports){
"use strict";
const moment = require("moment");
const BaseRouter_1 = require("./BaseRouter");
const DATE_SPREAD = 2;
class Search extends BaseRouter_1.BaseRouter {
    init() {
        this.router.get("/:from/:to/:date", (req, res) => this.search(req, res));
    }
    search(req, res) {
        this.api.getAirlines().then((airlines) => {
            const searchEach = airlines.map((airline) => {
                return this.getDateSpread(airline.code, req.params.date, req.params.from, req.params.to);
            });
            const all = [].concat.apply([], searchEach);
            this.sendResponse(Promise.all(all).then((searchResults) => {
                return this.merge(searchResults);
            }), res);
        });
    }
    getDateSpread(airlineCode, date, from, to) {
        const dates = [];
        for (let i = -DATE_SPREAD; i <= DATE_SPREAD; i++) {
            const currentDate = moment(date).add(i, "day").startOf("day");
            dates.push(currentDate.format("YYYY-MM-DD"));
        }
        return dates.map((flightDate) => this.getDate(airlineCode, flightDate, from, to).catch(() => {
            return { date, flights: [] };
        }));
    }
    getDate(airlineCode, date, from, to) {
        return this.api.getFlightSearch(airlineCode, date, from, to).then((data) => {
            return {
                date,
                flights: data.map((flight) => {
                    /* tslint:disable:object-literal-sort-keys */
                    return {
                        key: flight.key,
                        flightNum: flight.flightNum,
                        airlineName: flight.airline.name,
                        startTime: flight.start.dateTime,
                        finishTime: flight.finish.dateTime,
                        durationMin: flight.durationMin,
                        price: flight.price,
                    };
                }),
            };
        });
    }
    merge(results) {
        const categorised = {};
        results.forEach((result) => {
            if (!categorised[result.date]) {
                categorised[result.date] = [];
            }
            categorised[result.date] = categorised[result.date].concat(result.flights);
        });
        return categorised;
    }
}
exports.Search = Search;
const routes = new Search();
routes.init();
const router = routes.router;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;

},{"./BaseRouter":6,"moment":undefined}]},{},[3]);
