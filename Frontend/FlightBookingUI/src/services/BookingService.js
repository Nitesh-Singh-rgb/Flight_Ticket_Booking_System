import axios from 'axios';

export default class BookingService {
    constructor() {
        this.url = "http://localhost:8980/book";
    }

    async addBooking(
        numberOfSeatsToBook,
        flightNumber,
        source,
        destination,
        date
    ) {
        return await axios
            .post(
                this.url + "/booking",
                { numberOfSeatsToBook },
                {
                    params: {
                        fid: flightNumber,
                        source: source,
                        destination: destination,
                        date: date
                    }
                }
            )
            .then((response) => {
                console.log(response.data);
                if (response.data.length > 3) {
                    alert(response.data);
                    return response;
                }
                else {
                    localStorage.setItem("bid", parseInt(response.data));
                    return response;
                }
            });
    }

    async addPassengers(pass1) {
        return await axios
            .post(this.url + "/passenger/" + localStorage.getItem("bid"), pass1)
            .then((response) => {
                console.log(response.data);
            });
    }

    async generateTicket(ticket) {
        const uid = JSON.parse(localStorage.getItem("user")).userId;
        return await axios
            .post(
                this.url + "/ticket/" + uid + "/" + localStorage.getItem("bid") + "/1",
                ticket
            )
            .then((response) => {
                console.log(response.data);
                localStorage.setItem("ticket", JSON.stringify(response.data));
                return response;
            });
    }

    async getTickets() {
        const uid = JSON.parse(localStorage.getItem("user")).userId;
        return await axios.get(this.url + "/getTicket/" + uid)
            .then((response) => {
                console.log(response.data);
                return response;
            });
    }
}