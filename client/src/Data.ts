import * as $ from "jquery";

const HOST = "http://lvh.me:3000";

export const ENDPOINTS = {
    airlines: "/airlines",
    airports: "/airports",
    search: "/search",
};

export class Data {
    public static getEndpoint(endpoint: string) {
        return HOST + endpoint;
    }

    public search(from: string, to: string, date: string) {
        return $.get(HOST + ENDPOINTS.search + `/${from}/${to}/${date}`);
    }
}
