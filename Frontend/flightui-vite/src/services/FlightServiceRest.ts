interface Flight {
  fid: string;
  flightNumber: string;
  source: string;
  destination: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  availableSeats: number;
}

interface ApiError {
  message: string;
  status: number;
}

export default class FlightServiceRest {
  private uri: string = "http://localhost:8980/flight";
  private flights: Flight[] = [];

  private handleResponseError = async (response: Response): Promise<never> => {
    const error: ApiError = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  };

  async getFlight(): Promise<Flight[]> {
    try {
      const response = await fetch(`${this.uri}/fetchall`);
      if (!response.ok) {
        await this.handleResponseError(response);
      }
      const data: Flight[] = await response.json();
      console.log("flight data from service", data);
      this.flights = data;
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async saveFlight(flight: Flight): Promise<Flight> {
    try {
      const response = await fetch(`${this.uri}/add`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flight),
      });

      if (!response.ok) {
        await this.handleResponseError(response);
      }

      const data: Flight = await response.json();
      console.log("Flight saved:", data);
      return data;
    } catch (error) {
      console.error("Save flight error:", error);
      throw error;
    }
  }

  async updateFlight(flight: Flight): Promise<Flight> {
    try {
      const response = await fetch(`${this.uri}/update`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flight),
      });

      if (!response.ok) {
        await this.handleResponseError(response);
      }

      const data: Flight = await response.json();
      console.log("Flight updated:", data);
      return data;
    } catch (error) {
      console.error("Update flight error:", error);
      throw error;
    }
  }

  async deleteFlight(fid: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.uri}/remove/${fid}`, {
        method: "DELETE",
        mode: "cors",
      });

      if (!response.ok) {
        await this.handleResponseError(response);
      }

      console.log("Flight deleted:", fid);
      return { success: true };
    } catch (error) {
      console.error("Delete flight error:", error);
      throw error;
    }
  }

  async getFlightsForUser(
    source: string,
    destination: string,
    date: string
  ): Promise<Flight[]> {
    try {
      const response = await fetch(
        `${this.uri}/fetch?source=${source}&destination=${destination}&date=${date}`
      );

      if (!response.ok) {
        await this.handleResponseError(response);
      }

      const data: Flight[] = await response.json();
      console.log("flights data from service", data);
      return data;
    } catch (error) {
      console.error("Search flights error:", error);
      throw error;
    }
  }

  // Bonus: Local cache methods
  getCachedFlights(): Flight[] {
    return this.flights;
  }

  clearCache(): void {
    this.flights = [];
  }
}
