import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";

export class Authentication {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;
  constructor() {
    this.axiosInstance = axios.create({
      // baseURL: import.meta.env.VITE_API_URL,
      // baseURL: "https://api.mux04.com",
       baseURL: "http://localhost:8080",
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (
          config.url &&
          (config.url.includes("/user/login") ||
            config.url.includes("/user/register"))
        ) {
          return config;
        }
        const token = localStorage.getItem("token");
        if (token) {
          this.token = token;
          config.headers["Authorization"] = `${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          this.token = token;
          return true;
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
    this.logout();
    return false;
  }

  public extractRoleFromToken(): string | null {
    if (this.token) {
      try {
        const decodedToken: any = jwtDecode(this.token);
        return decodedToken.role || null;
      } catch (error) {
        console.error("Error extracting role from token:", error);
        return null;
      }
    }
    return null;
  }

  public async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post("/user/login", {
        email,
        password,
      });
      this.token = response.data.token;
      if (this.token) {
        localStorage.setItem("token", this.token);
      }
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  public async signup(
    name: string,
    surname: string,
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post("/user/register", {
        username: name + " " + surname,
        email,
        password,
      });
      this.token = response.data.token;
      if (this.token) {
        localStorage.setItem("token", this.token);
      }
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  }

  public logout(): void {
    this.token = null;
    localStorage.removeItem("token");
  }

  public getToken(): string | null {
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
export default new Authentication();
