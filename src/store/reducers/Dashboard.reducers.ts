import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { MasterData } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";

type initialStateType = {
  loading: boolean;
  data: {
    appreciation_feedback_count: number;
    complaint_feedback_count: number;
    department_user_count: number;
    field_survey_count: number;
  } | null;
  master_data: MasterData;
};

const localMasterData = SessionData.get("master_data");

const initialState: initialStateType = {
  loading: false,
  data: null,
  master_data: localMasterData ? JSON.parse(localMasterData) : null,
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
  },
  extraReducers: {},
});

export const { setLoading, setDashboardData, setMasterData } = DashboardReducer.actions;

export const getDashboardData = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      if (!store.getState().dashboard.master_data) {
        const masterData = await Request.get({ url: API_URLS.DATA.master_data });
        dispatch(setMasterData(masterData));
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
