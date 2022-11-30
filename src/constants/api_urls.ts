export const API_URLS = {
  BASE_URL: "http://your_api_url",
  LOGIN: "/login",
  SEND_OTP: "/get_otp",
  RESET_PASSWORD: "/reset_password",
  USERS: {
    GET_USERS: "/user",
    CREATE_USER: "/user",
    DELETE_USER: (id: number) => `/user/${id}`,
    UPDATE_USER: (id: number) => `/user/${id}`,
  },
  DATA: {
    initial_data: "/initial_data",
    dashboard_data: "/dashboard",
  },
};
