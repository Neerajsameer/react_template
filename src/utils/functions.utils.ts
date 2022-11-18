import axios, { Axios, AxiosError, AxiosRequestConfig } from "axios";
import _ from "lodash";
import { API_URLS } from "../constants/api_urls";
import store from "../store";

type local_keys = "user" | "master_data" | "map_filters" | "feedback_filters" | "field_survey_filters" | "dept_users";

export const SessionData = {
  set: (key: local_keys, data: any) => localStorage.setItem(key, data),
  get: (key: local_keys) => localStorage.getItem(key),
  has: (key: local_keys) => localStorage.hasOwnProperty(key),
  clear: (key: local_keys) => localStorage.removeItem(key),
  clearAll: () => localStorage.clear(),
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
    const response = await axios({
      ...axiosConfig,
      url: API_URLS.BASE_URL + axiosConfig.url,
      headers: {
        ...(axiosConfig.headers ?? {}),
        Authorization: "Bearer " + store.getState().auth.data?.access_token,
      },
    });
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
