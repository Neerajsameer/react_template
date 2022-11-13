import { showNotification } from "@mantine/notifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { MasterData } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";

type Feedback = {
  data: {
    id: number;
    feedback_type: number;
    s_feedback_id: string;
    s_no: number;
    feedback: string;
    added_on: string;
  }[];
  filters: {
    feedback_type?: string | null;
    from_date?: Date | null;
    to_date?: Date | null;
  };
  loading: boolean;
  feedback_id: number | null;
};

const localFeedbackFilters = JSON.parse(SessionData.get("feedback_filters") ?? "{}") as Feedback["filters"];

const feedbackInitialData: Feedback = {
  data: [],
  loading: false,
  filters: {
    feedback_type: localFeedbackFilters.feedback_type,
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

    setFeedbacks: (state, action: PayloadAction<Feedback["data"]>) => {
      state.data = action.payload;
    },

    setFeedbackFilters: (state, action: PayloadAction<Feedback["filters"]>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };

      if (state.filters.feedback_type == "0") state.filters.feedback_type = null;

      state.data = [];

      SessionData.set("feedback_filters", JSON.stringify(state.filters));
    },
    setFeedbackID: (state, action: PayloadAction<number | null>) => {
      state.feedback_id = action.payload;
    },
  },
});

export const { setLoading, resetState, setFeedbacks, setFeedbackFilters, setFeedbackID } = FeedbacksInitialSlice.actions;

export default FeedbacksInitialSlice.reducer;

export const getFeedbacks = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      let masterData = store.getState().dashboard.master_data;
      const feedbackFilters = store.getState().feedbacks.filters;
      const data = await Request.post({ url: API_URLS.DATA.feedbacks, data: feedbackFilters });
      const formattedData = data.map((x: any, i: number) => ({
        ...x,
        s_no: i + 1,
        feedback:
          x["feedback_type"] == 1 ? masterData.m_bad_road_type_list[x["m_feedback_id"]] : masterData.m_good_road_type_list[x["m_feedback_id"]],
        more: true,
      }));

      dispatch(setFeedbacks(formattedData));
    } catch (e: any) {
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};
