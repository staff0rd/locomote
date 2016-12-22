import { NextFunction, Request, Response , Router } from "express";
import * as http from "http";
import * as moment from "moment";
import {LocomoteApi} from "../LocomoteApi";
import {IAirline} from "../models/IAirline";
import {IDateResult} from "../models/IDateResult";
import {IFlightResult} from "../models/IFlightResult";
import {BaseRouter} from "./BaseRouter";

const DATE_SPREAD = 2;

export class Search extends BaseRouter {
    public init() {
        this.router.get("/:from/:to/:date", (req, res) => this.search(req, res));
    }

    public search(req: Request, res: Response) {
        this.api.getAirlines().then((airlines: IAirline[]) => {
            const searchEach = airlines.map((airline) => {
                return this.getDateSpread(airline.code, req.params.date, req.params.from, req.params.to);
            });

            const all = [].concat.apply([], searchEach);

            this.sendResponse(Promise.all(all).then((searchResults: any) => {
                return this.merge(searchResults);
            }), res);
        });
    }

    private getDateSpread(airlineCode: string, date: string, from: string, to: string) {
        const dates = [];

        for (let i = -DATE_SPREAD; i <= DATE_SPREAD; i++) {
            const currentDate = moment(date).add(i, "day").startOf("day");
            dates.push(currentDate.format("YYYY-MM-DD"));
        }

        return dates.map((flightDate) => this.getDate(airlineCode, flightDate, from, to).catch(() => {
            return <IDateResult> { date, flights: [] };
        }));
    }

    private getDate(airlineCode: string, date: string, from: string, to: string) {
        return this.api.getFlightSearch(airlineCode, date, from, to).then((data: any[]) => {
            return <IDateResult> {
                date,
                flights: data.map((flight) =>  {
                    /* tslint:disable:object-literal-sort-keys */
                    return <IFlightResult> {
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

    private merge(results: IDateResult[]) {
        const categorised: any = {};
        results.forEach((result) => {
            if (!categorised[result.date]) {
                categorised[result.date] = [];
            }
            categorised[result.date] = (<IFlightResult[]> categorised[result.date]).concat(result.flights);
        });
        return categorised;
    }
}

const routes = new Search();
routes.init();
const router = routes.router;

export default router;
