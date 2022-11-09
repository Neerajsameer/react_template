import { showNotification } from "@mantine/notifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_URLS } from "../../constants/api_urls";
import { Request } from "../../utils/functions.utils";

export type UsersType = {
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
  }[];
  loading: boolean;
  show_add_user_modal: boolean | null;
};

const usersInitialData: UsersType = {
  data: [],
  loading: false,
  show_add_user_modal: null,
};

export const UsersInitialSlice = createSlice({
  name: "Users",
  initialState: usersInitialData,
  reducers: {
    resetState: (state) => {
      state = { ...usersInitialData };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setUsersData: (state, action: PayloadAction<UsersType["data"]>) => {
      console.log("action.payload", action.payload);
      state.data = action.payload;
    },
    setShowAddUserModal: (state, action: PayloadAction<boolean>) => {
      state.show_add_user_modal = action.payload;
    },
  },
});

export const { setLoading, resetState, setUsersData, setShowAddUserModal } = UsersInitialSlice.actions;

export default UsersInitialSlice.reducer;

export const getUsers = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const data = await Request.get({ url: API_URLS.USERS.GET_USERS });
      console.log({ data });
      dispatch(setUsersData(data.map((x: any, i: number) => ({ ...x, s_no: i + 1 }))));
    } catch (e: any) {
      console.log({ e });
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createUser = (data: any) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      if (!data.name || !data.email || !data.password || !data.phone_number) throw "Please fill all the fields";
      await Request.post({ url: API_URLS.USERS.CREATE_USER, data });
      dispatch(setShowAddUserModal(false));
      dispatch(getUsers());
    } catch (e: any) {
      console.log({ e });
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};
