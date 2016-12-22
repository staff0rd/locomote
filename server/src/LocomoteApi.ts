import request = require("request");

const endPoints = {
    airlines: "http://node.locomote.com/code-task/airlines",
    airports: "http://node.locomote.com/code-task/airports",
    flight_search: "http://node.locomote.com/code-task/flight_search",
};

export class LocomoteApi {
    public getAirlines() {
        return this.getRequest(endPoints.airlines);
    }

    public getAirports(query: string) {
        return this.getRequest(`${endPoints.airports}?q=${query}`);
    }

    public getFlightSearch(airlineCode: string, date: string, from: string, to: string) {
        return this.getRequest(`${endPoints.flight_search}/${airlineCode}?date=${date}&from=${from}&to=${to}`);
    }

    private getRequest(endPoint: string) {
        console.log("GET: " + endPoint);
        return new Promise((resolve, reject) => {
            request(endPoint, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(JSON.parse(body));
                    // console.log(body);
                } else {
                    console.error(`${response.statusCode}: ${body}`);
                    reject(body);
                }
            });
        });
    }
}
