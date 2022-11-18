import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { MasterData } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";
import { apiUserData } from "./users.reducer";

type initialStateType = {
  loading: boolean;
  data: {
    appreciation_feedback_count: number;
    complaint_feedback_count: number;
    department_user_count: number;
    field_survey_count: number;
  } | null;
  master_data: MasterData;
  dept_users: apiUserData[];
};

const localMasterData = SessionData.get("master_data");
const localDeptUsers = SessionData.get("dept_users");

const initialState: initialStateType = {
  loading: false,
  data: null,
  master_data: localMasterData ? JSON.parse(localMasterData) : null,
  dept_users: localDeptUsers ? JSON.parse(localDeptUsers) : [],
};

export const DashboardReducer = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDashboardData: (state, action: PayloadAction<initialStateType["data"]>) => {
      state.data = action.payload;
    },
    setMasterData: (state, action: PayloadAction<MasterData>) => {
      state.master_data = action.payload;
      SessionData.set("master_data", JSON.stringify(action.payload));
    },
    setAllDeptUsers: (state, action: PayloadAction<apiUserData[]>) => {
      state.dept_users = action.payload;
      SessionData.set("dept_users", JSON.stringify(action.payload));
    },
  },
  extraReducers: {},
});

export const { setLoading, setDashboardData, setMasterData, setAllDeptUsers } = DashboardReducer.actions;

export const getDashboardData = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      if (!store.getState().dashboard.master_data) {
        const masterData = await Request.get({ url: API_URLS.DATA.master_data });
        dispatch(setMasterData(masterData));

        const users = await Request.get({ url: API_URLS.USERS.GET_USERS });
        dispatch(setAllDeptUsers(users));
      }

      const response = await Request.get({ url: API_URLS.DATA.dashboard_data });
      dispatch(setDashboardData(response));
      return response;
    } catch (e) {
      throw e;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export default DashboardReducer.reducer;
