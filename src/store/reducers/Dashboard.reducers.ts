import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { MasterData } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";
import { apiUserData } from "./users.reducer";

type initialStateType = {
  loading: boolean;
  data: {
    permissions: string[];
  } | null;
  initial_data: MasterData;
};

const localMasterData = SessionData.get("initial_data");

const initialState: initialStateType = {
  loading: false,
  data: null,
  initial_data: localMasterData ? JSON.parse(localMasterData) : null,
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
    setInitialData: (state, action: PayloadAction<MasterData>) => {
      state.initial_data = action.payload;
      SessionData.set("initial_data", JSON.stringify(action.payload));
    },
  },
  extraReducers: {},
});

export const { setLoading, setDashboardData, setInitialData } = DashboardReducer.actions;

export const getDashboardData = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      if (!store.getState().dashboard.initial_data) {
        const masterData: MasterData = await Request.get({ url: API_URLS.DATA.initial_data });
        dispatch(setInitialData(masterData));
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
