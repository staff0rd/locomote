import { NextFunction, Request, Response, Router } from "express";
import * as http from "http";
import {LocomoteApi} from "../LocomoteApi";
import {BaseRouter} from "./BaseRouter";

export class Airlines extends BaseRouter {
    public init() {
        this.router.get("/", (req, res) => this.getAll(req, res));
    }

    public getAll(req: Request, res: Response) {
        this.sendResponse(this.api.getAirlines(), res);
    }
}

const routes = new Airlines();
routes.init();
const router = routes.router;

export default router;
