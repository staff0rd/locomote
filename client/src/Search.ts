import * as $ from "jquery";
import * as moment from "moment";
import {Data} from "./Data";

(<any> window).moment = moment;

export class Search {
    public validationErrors: string[];
    public fromIsValid: boolean;
    public toIsValid: boolean;
    public dateIsValid: boolean;

    private from: string;
    private to: string;
    private date: string;
    private api: Data;

    constructor(from: string, to: string, date: string) {
        this.from = from;
        this.to = to;
        this.date = date;
        this.api = new Data();
    }

    public validate() {
        this.validationErrors = [];

        if (!this.from) {
            this.validationErrors.push("From field not valid");
            this.fromIsValid = false;
        } else {
            this.fromIsValid = true;
        }

        if (!this.to) {
            this.validationErrors.push("To field not valid");
            this.toIsValid = false;
        } else {
            this.toIsValid = true;
        }

        if (!this.validationErrors.length && this.to === this.from) {
            this.validationErrors.push("To and From fields are the same");
            this.toIsValid = false;
            this.fromIsValid = false;
        }

        const date = moment(this.date);

        if (!this.date || !date.isValid()) {
            this.validationErrors.push("Date field not valid");
            this.dateIsValid = false;
        } else {
            this.date = date.format("YYYY-MM-DD");
            this.dateIsValid = true;
        }
    }

    get isValid() {
        return !this.validationErrors.length;
    }

    public execute() {
        if (!this.isValid) {
            throw "Invalid request";
        }

        return this.api.search(this.from, this.to, this.date);
    }
}
