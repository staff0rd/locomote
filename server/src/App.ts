import * as bodyParser from "body-parser";
import cors = require("cors");
import * as express from "express";

import Airlines from "./routes/Airlines";
import Airports from "./routes/Airports";
import Search from "./routes/Search";

const corsOptions = {
  optionsSuccessStatus: 200,
  origin: "http://lvh.me:9000",
};

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.express.use(cors(corsOptions));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private configureRoutes(): void {
    this.express.use("/airlines", Airlines);
    this.express.use("/airports", Airports);
    this.express.use("/search", Search);
  }

}

export default new App().express;
