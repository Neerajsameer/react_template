import axios, { Axios, AxiosError, AxiosRequestConfig } from "axios";
import _ from "lodash";
import { API_URLS } from "../constants/api_urls";

export const SessionData = {
  set: (key: string, data: any) => localStorage.setItem(key, data),
  get: (key: string) => localStorage.getItem(key),
  has: (key: string) => localStorage.hasOwnProperty(key),
  clear: (key: string) => localStorage.removeItem(key),
};

type RequestParams = { url: string; data?: Record<string, any>; params?: Record<string, any>; headers?: Record<string, any> };

export const Request = {
  get: async (_: RequestParams) => makeApiCall({ ..._, method: "GET" }),
  post: async (_: RequestParams) => makeApiCall({ ..._, method: "POST" }),
  put: async (_: RequestParams) => makeApiCall({ ..._, method: "PUT" }),
  delete: async (_: RequestParams) => makeApiCall({ ..._, method: "DELETE" }),
};

async function makeApiCall(axiosConfig: AxiosRequestConfig) {
  try {
    const response = await axios({ ...axiosConfig, url: API_URLS.BASE_URL + axiosConfig.url });
    console.log({ res: response.data });
    return response.data?.["meta"]?.["data"];
  } catch (e: any) {
    const error = e as AxiosError;
    if ((error.response?.data as any)?.meta?.msg) throw (error.response?.data as any).meta.msg || "Something Went Wrong. Please Contact Support";
    else if (error.response?.status) throw (errorCodes as any)[error.response.status];
    else throw error.message;
  }
}

const errorCodes = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
};
