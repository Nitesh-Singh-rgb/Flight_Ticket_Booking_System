import axios from 'axios';
import type { AxiosResponse } from 'axios';


interface Passenger {
  name: string;
  age: number;
  gender: string;
  passportNumber?: string;
}

interface Ticket {
  passengerId: number;
  seatNumber: string;
  price: number;
  flightId: string;
}

interface User {
  userId: string;
  isadmin?: number;
  username?: string;
}


export default class BookingService {
  private url: string = "http://localhost:8980/book";

  private getStoredUser = (): User | null => {
    try {
      const item = localStorage.getItem("user");
      return item ? JSON.parse(item) as User : null;
    } catch {
      return null;
    }
  };

  private getStoredBid = (): string | null => localStorage.getItem("bid");

  async addBooking(
    numberOfSeatsToBook: number,
    flightNumber: string,
    source: string,
    destination: string,
    date: string
  ): Promise<AxiosResponse> {
    return axios
      .post(this.url + "/booking", { numberOfSeatsToBook }, {
        params: { fid: flightNumber, source, destination, date }
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        
        if (typeof data === 'string' && data.length > 3) {
          alert(data);
          return response;
        }
        
        if (typeof data === 'number') {
          localStorage.setItem("bid", data.toString());
        }
        return response;
      })
      .catch((error) => {
        console.error("Booking failed:", error);
        throw error;
      });
  }

  async addPassengers(pass1: Passenger): Promise<AxiosResponse> {
    const bid = this.getStoredBid();
    if (!bid) throw new Error("No booking ID found in localStorage");

    return axios
      .post(`${this.url}/passenger/${bid}`, pass1)
      .then((response) => {
        console.log(response.data);
        return response;
      })
      .catch((error) => {
        console.error("Adding passengers failed:", error);
        throw error;
      });
  }

  async generateTicket(ticket: Ticket): Promise<AxiosResponse> {
    const user = this.getStoredUser();
    const bid = this.getStoredBid();
    
    if (!user?.userId || !bid) {
      throw new Error("User ID or booking ID not found in localStorage");
    }

    return axios
      .post(`${this.url}/ticket/${user.userId}/${bid}/1`, ticket)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("ticket", JSON.stringify(response.data));
        return response;
      })
      .catch((error) => {
        console.error("Ticket generation failed:", error);
        throw error;
      });
  }

  async getTickets(): Promise<AxiosResponse<Ticket[]>> {
    const user = this.getStoredUser();
    if (!user?.userId) {
      throw new Error("User ID not found in localStorage");
    }

    return axios
      .get(`${this.url}/getTickets/${user.userId}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Fetching tickets failed:", error);
        throw error;
      });
  }
}
