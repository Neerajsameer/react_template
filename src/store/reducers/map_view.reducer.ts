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
    m_district_id: number;
    m_state_id: number;
  }[];
  district_ids: number[];
  filters: {
    from_date?: Date | null;
    to_date?: Date | null;
    complaint_types?: string[];
    appreciation_types?: string[];
    field_survey?: boolean;
    m_state_id?: number;
    m_district_id?: number;
    m_department_id?: number;
    m_user_id?: number;
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
  district_ids: [],
  loading: false,
  filters: {
    from_date: localFeedbackFilters.from_date ? new Date(localFeedbackFilters.from_date) : new Date(new Date().setDate(new Date().getDate() - 7)),
    to_date: new Date(),
    complaint_types: localFeedbackFilters.complaint_types ?? [],
    appreciation_types: localFeedbackFilters.appreciation_types ?? [],
    field_survey: true,
    m_state_id: localFeedbackFilters.m_state_id,
    m_district_id: localFeedbackFilters.m_district_id,
    m_department_id: localFeedbackFilters.m_department_id,
    m_user_id: localFeedbackFilters.m_user_id,
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
    setMapDistrictIDs: (state, action: PayloadAction<number[]>) => {
      state.district_ids = action.payload;
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

export const { setLoading, resetState, setMapData, setMapFilters, setMapDistrictIDs, setFeedbackID, setExtraDetails, setShowFilters } =
  MapDataInitialSlice.actions;

export default MapDataInitialSlice.reducer;

export const getMapData = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const mapFilters = store.getState().map_view.filters;
      const data: MapData["data"] = await Request.post({ url: API_URLS.DATA.map_data, data: mapFilters });
      const formattedData = data.filter((item) => item.latitude !== null && item.longitude !== null && item.type);

      const district_ids = data.map((x) => x.m_district_id);

      dispatch(setMapDistrictIDs(district_ids));

      dispatch(setMapData(data));
    } catch (e: any) {
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};
