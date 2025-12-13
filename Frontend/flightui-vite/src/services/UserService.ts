import axios from 'axios';
import type { AxiosResponse } from 'axios';

interface User {
  username: string;
  password: string;
  userId?: string;
  isadmin?: number;
}

interface AuthResponse {
  userId: string;
  username: string;
  isadmin?: number;
}

export default class UserService {
  private url: string = "http://localhost:8980/";

  async addUser(user: User): Promise<AxiosResponse> {
    return axios
      .post(`${this.url}/createuser`, user)
      .then((response: AxiosResponse) => {
        console.log("User created:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response;
      })
      .catch((error) => {
        console.error("User creation failed:", error);
        throw error;
      });
  }

  async validateUser(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return axios
      .get(`${this.url}/auth/${username}/${password}`)
      .then((response: AxiosResponse<AuthResponse>) => {
        console.log("User validated:", response.data);
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response;
      })
      .catch((error) => {
        console.error("User validation failed:", error);
        throw error;
      });
  }

  // Static helper methods (bonus)
  static getStoredUser(): User | null {
    try {
      const item = localStorage.getItem("user");
      return item ? JSON.parse(item) as User : null;
    } catch {
      return null;
    }
  }

  static isUserAdmin(): boolean {
    const user = UserService.getStoredUser();
    return user?.isadmin === 1;
  }

  static logout(): void {
    localStorage.removeItem("user");
  }
}
