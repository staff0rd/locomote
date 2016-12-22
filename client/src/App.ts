import * as $ from "jquery";
import * as moment from "moment";

import {Data, ENDPOINTS} from "./Data";
import {Search} from "./Search";
import {TabLayout} from "./TabLayout";

import {IDateResult} from "../../server/src/models/IDateResult";

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
        $("#from").select2({ ajax: ajaxOptions, minimumInputLength: 2, placeholder: "Flying from"});
        $("#to").select2({ ajax: ajaxOptions, minimumInputLength: 2, placeholder: "Flying to"});
        $("#loader").addClass("hide");
        //$.get("data.json").then((result) => this.layoutResults(result));
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
                this.layoutResults(data);
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

    private layoutResults(searchResult: any) {
        const tabs = new TabLayout(searchResult);
        $("#result").html(tabs.getHtml());
        $("#result table").DataTable({
            dom: "<t><\"col-sm-4\"l><\"col-sm-4\"i>p",
            order: [[2, "asc"]],
        });

        $('a[data-toggle="tab"]').click((e) => {
            e.preventDefault();
            (<any> $(e.target)).tab("show");
        });

        if (tabs.dates.length) {
            (<any> $($('a[data-toggle="tab"]')[tabs.active])).tab("show");
        }
    }
}
