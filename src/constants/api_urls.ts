export const API_URLS = {
  BASE_URL: "http://68.178.163.212:8082", //"http://127.0.0.1:8082"
  LOGIN: "/department/login",
  USERS: {
    GET_USERS: "/department/users",
    CREATE_USER: "/department/signup",
    DELETE_USER: (id: number) => `/department/users/${id}`,
    UPDATE_USER: (id: number) => `/department/users/${id}`,
  },
  DATA: {
    feedbacks: "/feedback_data",
    field_survey: "/survey_data",
    master_data: "/master_data",
    map_data: "/map_data",
    dashboard_data: "/dashboard_data",
    feedback_images: (id: number) => `/feedback_images/${id}`,
    get_feedback: (id: number) => `/feedback/${id}`,
    get_field_survey: (id: number) => `/survey/${id}`,
  },
};
