import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_URLS } from "../../constants/api_urls";
import { Request } from "../../utils/functions.utils";

type initialStateType = {
  loading: boolean;
  data: {
    appreciation_feedback_count: number;
    complaint_feedback_count: number;
    department_user_count: number;
    field_survey_count: number;
  } | null;
};

const initialState: initialStateType = {
  loading: false,
  data: null,
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
  },
  extraReducers: {},
});

export const { setLoading, setDashboardData } = DashboardReducer.actions;

export const getDashboardData = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
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
