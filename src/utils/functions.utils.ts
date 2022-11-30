import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_URLS } from "../constants/api_urls";
import store from "../store";
import { UsersType } from "../store/reducers/users.reducer";

type local_keys = "user" | "initial_data" | "user_filters";

export const SessionData = {
  set: (key: local_keys, data: any) => localStorage.setItem(key, data),
  get: (key: local_keys) => localStorage.getItem(key),
  has: (key: local_keys) => localStorage.hasOwnProperty(key),
  clear: (key: local_keys) => localStorage.removeItem(key),
  clearAll: () => localStorage.clear(),
};

type RequestParams = {
  url: string;
  data?: Record<string, any>;
  params?: Record<string, any>;
  headers?: Record<string, any>;
};

export const Request = {
  get: async (_: RequestParams) => makeApiCall({ ..._, method: "GET" }),
  post: async (_: RequestParams) => makeApiCall({ ..._, method: "POST" }),
  put: async (_: RequestParams) => makeApiCall({ ..._, method: "PUT" }),
  delete: async (_: RequestParams) => makeApiCall({ ..._, method: "DELETE" }),
};

async function makeApiCall(axiosConfig: AxiosRequestConfig) {
  try {
    /*
      Dummy Responses
    */

    if (axiosConfig.url?.includes("/initial_data")) return dummyData["initial_data"];
    else if (axiosConfig.url?.includes("/user")) return dummyData["users"];
    else if (axiosConfig.url?.includes("/login")) return dummyData["users"][0];

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
    if ((error.response?.data as any)?.meta?.msg)
      throw (error.response?.data as any).meta.msg || "Something Went Wrong. Please Contact Support";
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

const dummyData = {
  initial_data: {
    permissions: ["create_user", "dashboard_view"],
    m_designation: ["Software Engineer", "Full Stack Developer", "Software trainee"],
    m_department: ["Cyber Security", "App Development", "Devops"],
  },
  users: [
    {
      email: "test@gmail.com",
      id_app_user: 1,
      s_no: 1,
      name: "Test User",
      phone_number: "99922266687",
      m_designation_id: 1,
      m_department_id: 1,
      added_on: "2022-10-09",
    },
    {
      email: "abc@gmail.com",
      id_app_user: 7,
      s_no: 2,
      name: "ABC User",
      phone_number: "9355827592",
      m_designation_id: 0,
      m_department_id: 2,
      added_on: "2021-04-01",
    },
    {
      email: "xyz@gmail.com",
      id_app_user: 4,
      s_no: 3,
      name: "ABC User",
      phone_number: "7394529452",
      m_designation_id: 0,
      m_department_id: 2,
      added_on: "2021-04-01",
    },
  ],
};
