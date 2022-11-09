import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_URLS } from "../../constants/api_urls";
import { MasterData, SessionKeys } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";

const user = SessionData.get(SessionKeys.USER);
const localMasterData = SessionData.get("master_data");

type initialStateType = {
  loading: boolean;
  isLoggedIn: boolean;
  data: {
    user_name: string;
    email: string;
    phone_number: string;
    access_token: string | null;
    permission: [];
  } | null;
  master_data: MasterData;
};

const initialState: initialStateType = {
  loading: false,
  isLoggedIn: !!user,
  data: user ? JSON.parse(user) : null,
  master_data: localMasterData ? JSON.parse(localMasterData) : null,
};

export const AuthReducer = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<initialStateType["data"]>) => {
      state.data = action.payload;
      SessionData.set(SessionKeys.USER, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = null;
      SessionData.clear(SessionKeys.USER);
      window.location.href = "/login";
      console.log("Done");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMasterData: (state, action: PayloadAction<MasterData>) => {
      state.master_data = action.payload;
      SessionData.set("master_data", JSON.stringify(action.payload));
    },
  },
  extraReducers: {},
});

export const { login, logout, setLoading, setMasterData } = AuthReducer.actions;

export const loginReqAuthentication = (email: string, password: string) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      if (!email || !password) throw "Please enter email and password";
      const response = await Request.post({ url: API_URLS.LOGIN, data: { email, password } });
      const masterData = (await Request.get({ url: API_URLS.DATA.master_data })) as MasterData;
      dispatch(setMasterData(masterData));
      dispatch(login(response));
      return response;
    } catch (e) {
      console.log({ e });

      throw e;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export default AuthReducer.reducer;
