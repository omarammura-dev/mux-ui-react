import { AxiosRequestConfig, AxiosResponse } from "axios";
import Authentication from "./Auth/Authentication";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions<T = any>
  extends Omit<AxiosRequestConfig, "method" | "url" | "data"> {
  method: HttpMethod;
  url: string;
  data?: T;
  responseType?: AxiosRequestConfig["responseType"];
}

async function request<T = any, R = any>({
  method,
  url,
  data,
  responseType,
  ...config
}: RequestOptions<T>): Promise<R> {
  try {
    const api = Authentication.getAxiosInstance();
    const response = await api.request<T, AxiosResponse<R>>({
      method,
      url,
      data,
      responseType,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

const get = <R = any>(
  url: string,
  config?: Omit<RequestOptions, "method" | "url" | "data">
) => request<never, R>({ method: "GET", url, ...config });

const post = <T = any, R = any>(
  url: string,
  data?: T,
  config?: Omit<RequestOptions, "method" | "url" | "data">
) => request<T, R>({ method: "POST", url, data, ...config });

const put = <T = any, R = any>(
  url: string,
  data?: T,
  config?: Omit<RequestOptions, "method" | "url" | "data">
) => request<T, R>({ method: "PUT", url, data, ...config });

const del = <R = any>(
  url: string,
  config?: Omit<RequestOptions, "method" | "url" | "data">
) => request<never, R>({ method: "DELETE", url, ...config });

const patch = <T = any, R = any>(
  url: string,
  data?: T,
  config?: Omit<RequestOptions, "method" | "url" | "data">
) => request<T, R>({ method: "PATCH", url, data, ...config });

export { request, get, post, put, del, patch };
