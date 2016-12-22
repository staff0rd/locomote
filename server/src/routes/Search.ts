import { NextFunction, Request, Response , Router } from "express";
import * as http from "http";
import {LocomoteApi} from "../LocomoteApi";
import {IAirline} from "../models/IAirline";
import {ISearchResult} from "../models/ISearchResult";
import {BaseRouter} from "./BaseRouter";

export class Search extends BaseRouter {
    public init() {
        this.router.get("/:from/:to/:date", (req, res) => this.search(req, res));
    }

    public search(req: Request, res: Response) {
        this.api.getAirlines().then((airlines: IAirline[]) => {
            const searchEach = airlines.map((airline) => {
                return this.api.getFlightSearch(airline.code, req.params.date, req.params.from, req.params.to)
                .then((data: any[]) => {
                    /* tslint:disable:object-literal-sort-keys */
                    return data.map((flight) => {
                        return {
                            key: flight.key,
                            flightNum: flight.flightNum,
                            airlineName: flight.airline.name,
                            startTime: flight.start.dateTime,
                            finishTime: flight.finish.dateTime,
                            durationMin: flight.durationMin,
                            price: flight.price,
                        };
                    });
                });
            });

            this.sendResponse(Promise.all(searchEach).then((searchResults: any) => {
                return this.merge(searchResults);
            }), res);
        });
    }

    private merge(results: ISearchResult[][]) {
        return [].concat.apply([], results);
    }
}

const routes = new Search();
routes.init();
const router = routes.router;

export default router;
