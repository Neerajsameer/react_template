import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { MasterData } from "../../constants/types";
import { Request, SessionData } from "../../utils/functions.utils";

const user = SessionData.get("user");

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
};

const initialState: initialStateType = {
  loading: false,
  isLoggedIn: !!user,
  data: user ? JSON.parse(user) : null,
};

export const AuthReducer = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<initialStateType["data"]>) => {
      state.data = action.payload;
      SessionData.set("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = null;
      SessionData.clearAll();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {},
});

export const { login, logout, setLoading } = AuthReducer.actions;

export const loginReqAuthentication = (email: string, password: string) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      if (!email || !password) throw "Please enter email and password";
      const response = await Request.post({ url: API_URLS.LOGIN, data: { email, password } });
      dispatch(setLoading(false));

      dispatch(login(response));
      return response;
    } catch (e) {
      throw e;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export default AuthReducer.reducer;
