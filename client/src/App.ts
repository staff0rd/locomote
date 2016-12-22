import * as $ from "jquery";
import * as moment from "moment";
import {Cells} from "./Cells";
import {Data, ENDPOINTS} from "./Data";
import {Search} from "./Search";

import {ISearchResult} from "../../server/src/models/ISearchResult";
import {Utils} from "./Utils";

export class App {
    constructor() {
        $("#search-form").submit((ev) => {
            this.submit();
            ev.preventDefault();
        });

        const ajaxOptions = {
            cache: false,
            data: (params: any) => {
                return {
                    page: params.page,
                    q: params.term,
                };
            },
            dataType: "json",
            delay: 250,
            processResults: (data, params) => {
                return {
                    results: $.map(data, (obj) => {
                        return {
                            id: obj.airportCode,
                            text: `${obj.airportName}, ${obj.cityName}, ${obj.countryName}`,
                        };
                    }),
                };
            },
            url: (params) => `${Data.getEndpoint(ENDPOINTS.airports)}/${params.term}`,
        };

        $.fn.select2.defaults.set("theme", "bootstrap");
        $("#from").select2({ ajax: ajaxOptions, minimumInputLength: 1, placeholder: "Flying from"});
        $("#to").select2({ ajax: ajaxOptions, minimumInputLength: 1, placeholder: "Flying to"});
        $("#loader").addClass("hide");
    }

    private submit() {
        $("#from,#to,#date").parent().removeClass("has-error");

        $("#result").html("");

        const search = new Search($("#from").val(), $("#to").val(), $("#date").val());

        $("#validation").html("");

        search.validate();

        if (search.isValid) {
            (<any> $("#submit")).button("loading");
            $("#loader").removeClass("hide");
            search.execute().then((data) => {
                this.layout(data);
                (<any> $("#submit")).button("reset");
                $("#loader").addClass("hide");
            }).fail((error) => {
                $("#validation").html(`<h2>An error occurred</h2><ul><li>${error.responseText}</li></ul>`);
                (<any> $("#submit")).button("reset");
                $("#loader").addClass("hide");
            });
        } else {
            const errors = search.validationErrors.map((err) => `<li>${err}</li>`).join("");
            $("#validation").html(`<h2>Please fix the following issues</h2><ul>${errors}</ul>`);

            this.setValid(search.fromIsValid, "from");
            this.setValid(search.toIsValid, "to");
            this.setValid(search.dateIsValid, "date");
        }
    }

    private setValid(isValid: boolean, id: string) {
        if (isValid) {
            $(`#${id}`).parent().removeClass("has-error");
        } else {
            $(`#${id}`).parent().addClass("has-error");
        }
    }

    private layout(searchResult: ISearchResult[]) {
        const rows: string[] = [];
        searchResult.forEach((result) => {
            const cells = new Cells()
            .add(result.airlineName)
            .add(result.flightNum)
            .add(moment(result.startTime).format("hh:mm a"), `data-order="${moment(result.startTime).toISOString()}"`)
            .add(moment(result.finishTime).format("hh:mm a"), `data-order="${moment(result.startTime).toISOString()}"`)
            .add(Utils.getDuration(result.durationMin), `data-order="${result.durationMin}"`)
            .add(parseFloat(String(result.price)).toFixed(2));

            rows.push(`<tr>${cells.data}</tr>`);
        });

        $("#result").html(`
        <h2>Flights</h2>
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
        </tbody></table>`);
        $("#result table").DataTable({searching: false, order: [[2, "asc"]]});
    }
}
