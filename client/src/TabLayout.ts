import * as moment from "moment";
import {IDateResult} from "../../server/src/models/IDateResult";
import {Cells} from "./Cells";
import {Utils} from "./Utils";

export class TabLayout {
    public dates: IDateResult[];
    public active: number;
    constructor(dates: any) {
        this.dates = Object.keys(dates).map((key) => <IDateResult> { date: key, flights: dates[key] });
        this.active = Math.max(0, this.dates.length - 3);
    }

    public getHtml() {
        return "<h2>Flights</h2><div id='tabs'>" + this.getHeader() + this.getPanes() + "</div>";
    }

    private getHeader() {
        let header = `<ul class='nav nav-tabs'>`;
        header += this.dates.map((dr) => `
            <li>
                <a href='#${this.getId(dr.date)}' 
                    data-toggle='tab'${this.dates[this.active].date === dr.date ? " class='active'" : ""}>
                        ${moment(dr.date).format("ddd, Do MMM")}
                </a>
            </li>`).join("");
        header += `</ul>`;
        return header;
    }

    private getPanes() {
        let panes = `<div class="tab-content">`;
        panes += this.dates.map((dr) => `
            <div class="tab-pane${this.dates[this.active].date === dr.date ? " active" : ""}" 
                id="${this.getId(dr.date)}">
                    ${this.getTable(dr)}
            </div>`).join("");
        panes += `</div>`;
        return panes;
    }

    private getId(dateString: string) {
        return `result-${dateString}`;
    }

    private getTable(searchResult: IDateResult) {
        const rows = this.getRows(searchResult);

        const table = `
        <table class="table">
            <thead>
                <tr>
                    <th>Airline</th>
                    <th>Flight#</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Duration</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>${rows.join("")}
        </tbody></table>`;

        return table;
    }

    private getRows(searchResult: IDateResult) {
        const rows: string[] = [];
        searchResult.flights.forEach((result) => {
            const cells = new Cells()
            .add(result.airlineName)
            .add(result.flightNum)
            .add(moment(result.startTime).format("hh:mm a"), `data-order="${moment(result.startTime).toISOString()}"`)
            .add(moment(result.finishTime).format("hh:mm a"), `data-order="${moment(result.startTime).toISOString()}"`)
            .add(Utils.getDuration(result.durationMin), `data-order="${result.durationMin}"`)
            .add("$" + parseFloat(String(result.price)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"));
            rows.push(`<tr>${cells.data}</tr>`);
        });
        return rows;
    }
}
