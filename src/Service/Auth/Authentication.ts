import axios, { AxiosInstance } from "axios";
import { post } from "../request";

class Authentication {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          this.token = token;
          config.headers["Authorization"] = `Bearer ${token}`;
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
      this.token = token;
      return true;
    }
    return false;
  }

  public async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await post("/login", { email, password });
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
      const response = await post("/signup", {
        name,
        surname,
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
