import { showNotification } from "@mantine/notifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { FieldSurveyDataType } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";

type FieldSurveyType = {
  data: FieldSurveyDataType[];
  filters: {
    from_date?: Date | null;
    to_date?: Date | null;
  };
  loading: boolean;
  feedback_id: number | null;
};

const localFeedbackFilters = JSON.parse(SessionData.get("field_survey_filters") ?? "{}") as FieldSurveyType["filters"];

const feedbackInitialData: FieldSurveyType = {
  data: [],
  loading: false,
  filters: {
    from_date: localFeedbackFilters.from_date ? new Date(localFeedbackFilters.from_date) : new Date(),
    to_date: localFeedbackFilters.to_date ? new Date(localFeedbackFilters.to_date) : new Date(),
  },
  feedback_id: null,
};

export const FeedbacksInitialSlice = createSlice({
  name: "Feedbacks",
  initialState: feedbackInitialData,
  reducers: {
    resetState: (state) => {
      state = { ...feedbackInitialData };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setFieldSurveyData: (state, action: PayloadAction<FieldSurveyType["data"]>) => {
      state.data = action.payload;
    },

    setFieldSurveyFilters: (state, action: PayloadAction<FieldSurveyType["filters"]>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };

      state.data = [];

      SessionData.set("field_survey_filters", JSON.stringify(state.filters));
    },
    setFeedbackID: (state, action: PayloadAction<number | null>) => {
      state.feedback_id = action.payload;
    },
  },
});

export const { setLoading, resetState, setFieldSurveyData, setFieldSurveyFilters, setFeedbackID } = FeedbacksInitialSlice.actions;

export default FeedbacksInitialSlice.reducer;

export const getFieldSurveys = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const fieldSurveyFilters = store.getState().feedbacks.filters;
      const data = await Request.post({ url: API_URLS.DATA.field_survey, data: fieldSurveyFilters });
      const formattedData = data.map((x: any, i: number) => ({
        s_no: i + 1,
        id: x.f_survey_general_details.f_survey_general_details_id,
        created_at: new Date(x.f_survey_general_details.added_on),
        m_state_id: x.f_survey_general_details.m_state_id,
        m_district_id: x.f_survey_general_details.m_district_id,
        m_designation_id: x.f_survey_general_details.m_designation_id,
        m_department_id: x.f_survey_general_details.m_department_id,
        highway_number: x.f_survey_road_details.highway_number,
        repr_name: x.f_survey_general_details.repr_name,
        user_id: x.f_survey_general_details.repr_id,
        
      }));

      dispatch(setFieldSurveyData(formattedData));
    } catch (e: any) {
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};
