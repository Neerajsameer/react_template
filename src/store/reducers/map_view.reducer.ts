import { showNotification } from "@mantine/notifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { filter } from "lodash";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { MasterData } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";

type MapData = {
  data: {
    id: number;
    type: "appreciation" | "complaint" | "survey";
    added_on: string;
    latitude: number;
    longitude: number;
  }[];
  filters: {
    from_date?: Date | null;
    to_date?: Date | null;
    complaint_types?: string[];
    appreciation_types?: string[];
    field_survey?: boolean;
  };
  loading: boolean;
  feedback_id: number | null;
  extra_details: {
    clicked_id: number | null;
    clicked_type: "appreciation" | "complaint" | "survey";
  } | null;
  show_filters: boolean;
};

const localMasterData = SessionData.get("master_data");
const localFeedbackFilters = JSON.parse(SessionData.get("map_filters") ?? "{}") as MapData["filters"];

const mapInitialData: MapData = {
  data: [],
  loading: false,
  filters: {
    from_date: localFeedbackFilters.from_date ? new Date(localFeedbackFilters.from_date) : null,
    to_date: localFeedbackFilters.to_date ? new Date(localFeedbackFilters.to_date) : null,
    complaint_types: localFeedbackFilters.complaint_types ?? [],
    appreciation_types: localFeedbackFilters.appreciation_types,
    field_survey: true,
  },
  feedback_id: null,
  extra_details: null,
  show_filters: false,
};

export const MapDataInitialSlice = createSlice({
  name: "MapData",
  initialState: mapInitialData,
  reducers: {
    resetState: (state) => {
      state = { ...mapInitialData };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setMapData: (state, action: PayloadAction<MapData["data"]>) => {
      state.data = action.payload;
    },

    setMapFilters: (state, action: PayloadAction<MapData["filters"]>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };

      state.data = [];

      SessionData.set("map_filters", JSON.stringify(state.filters));
    },
    setFeedbackID: (state, action: PayloadAction<number | null>) => {
      state.feedback_id = action.payload;
    },
    setExtraDetails: (state, action: PayloadAction<MapData["extra_details"]>) => {
      state.extra_details = action.payload;
    },
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.show_filters = action.payload;
    },
  },
});

export const { setLoading, resetState, setMapData, setMapFilters, setFeedbackID, setExtraDetails, setShowFilters } = MapDataInitialSlice.actions;

export default MapDataInitialSlice.reducer;

export const getMapData = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const mapFilters = store.getState().map_view.filters;
      const data: MapData["data"] = await Request.post({ url: API_URLS.DATA.map_data, data: mapFilters });
      const formattedData = data.filter((item) => item.latitude !== null && item.longitude !== null && item.type);
      dispatch(setMapData(formattedData));
    } catch (e: any) {
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};
