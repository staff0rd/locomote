import { NextFunction, Request, Response, Router } from "express";
import * as http from "http";
import {LocomoteApi} from "../LocomoteApi";
import {BaseRouter} from "./BaseRouter";

export class Airports extends BaseRouter {
    public init() {
        this.router.get("/:query", (req, res) => this.getAll(req, res));
    }

    public getAll(req: Request, res: Response) {
        this.sendResponse(this.api.getAirports(req.params.query), res);
    }
}

const routes = new Airports();
routes.init();
const router = routes.router;

export default router;
