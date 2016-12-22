import { NextFunction, Request, Response, Router } from "express";
import {LocomoteApi} from "../LocomoteApi";

export abstract class BaseRouter {
    public router: Router;
    protected api: LocomoteApi;

    constructor() {
        this.api = new LocomoteApi();
        this.router = Router();
        this.init();
    }

    public abstract init(): void;

    protected sendResponse(promise: Promise<any>, res: Response) {
        promise.then((result) => {
            res.json(result);
        }).catch((error) => {
            res.send(500, error);
        });
    }
}
