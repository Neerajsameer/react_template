import { showNotification } from "@mantine/notifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "..";
import { API_URLS } from "../../constants/api_urls";
import { Request } from "../../utils/functions.utils";

export type apiUserData = {
  s_no: number;
  id_app_user: number;
  name: string;
  email: string;
  phone_number: string;
  m_user_type_id: number;
  m_designation_id: number;
  m_department_id: number;
  added_on: string;
};

export type UsersType = {
  data: apiUserData[];
  edit_user_data: (apiUserData & { password: string; re_enter_password: string }) | null;
  loading: boolean;
  show_add_user_modal: boolean | null;
};

const usersInitialData: UsersType = {
  data: [],
  edit_user_data: null,
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
      state.data = action.payload;
    },
    setEditUserData: (state, action: PayloadAction<any>) => {
      state.edit_user_data = action.payload == null ? null : { ...state.edit_user_data, ...action.payload };
    },
    setShowAddUserModal: (state, action: PayloadAction<{ data?: apiUserData | null; show: boolean }>) => {
      state.show_add_user_modal = action.payload.show;
      state.edit_user_data = (action.payload.data as any) ?? null;
    },
  },
});

export const { setLoading, resetState, setUsersData, setShowAddUserModal, setEditUserData } = UsersInitialSlice.actions;

export default UsersInitialSlice.reducer;

export const getUsers = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const data = await Request.get({ url: API_URLS.USERS.GET_USERS });
      dispatch(setUsersData(data.map((x: any, i: number) => ({ ...x, s_no: i + 1 }))));
    } catch (e: any) {
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createUser = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    const editUserData = store.getState().users.edit_user_data;

    try {
      if (!editUserData?.name || !editUserData?.email || !editUserData?.password || !editUserData?.re_enter_password || !editUserData?.phone_number)
        throw "Please fill all the fields";
      if (editUserData?.password !== editUserData?.re_enter_password) throw "Passwords do not match";

      if (editUserData.id_app_user) await Request.put({ url: API_URLS.USERS.UPDATE_USER(editUserData.id_app_user), data: editUserData });
      else await Request.post({ url: API_URLS.USERS.CREATE_USER, data: editUserData });
      dispatch(setShowAddUserModal({ show: false }));
      dispatch(getUsers());
    } catch (e: any) {
      showNotification({ title: "Error", message: e, color: "red" });
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteUser = (user_id: number) => {
  return async (dispatch: any) => {
    try {
      await Request.delete({ url: API_URLS.USERS.DELETE_USER(user_id) });
      dispatch(getUsers());
    } catch (e: any) {
      showNotification({ title: "Error", message: e, color: "red" });
    }
  };
};
