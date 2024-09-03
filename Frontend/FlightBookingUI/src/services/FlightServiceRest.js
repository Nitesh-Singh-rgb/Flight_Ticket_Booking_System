
export default class FlightServiceRest {
    constructor() {
        this.uri = "http://localhost:5000/flight";
        this.flights = [];
    }

    async getFlight() {
        return await fetch(this.uri + "/fetchall")
            .then((response) => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .then((data) => {
                console.log("flight data from service " + data);
                return data;
            })
            .catch((error) => {
                console.log("Error : " + error.message);
            });
    }

    async saveFlight(flight) {
        return await fetch(this.uri + "/add", {
            method: "POST",
            mode: "cors",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(flight)
        })
            .then((response) => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    async getFlightsForUser(source, destination, date) {
        return await fetch(
            this.uri +
            `/fetch?source=${source}&destination=${destination}&date=${date}`
        )
            .then((response) => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .then((data) => {
                console.log("flights data from service" + data);
                return data;
            })
            .catch((error) => {
                console.log("Error : " + error.message);
            });
    }
}