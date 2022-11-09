import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import AuthReducer from "./reducers/Auth.reducers";
import UsersReducer from "./reducers/users.reducer";
import FeedbacksReducer from "./reducers/feedbacks.reducer";
import MapViewReducer from "./reducers/map_view.reducer";
import DashboardReducer from "./reducers/Dashboard.reducers";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    users: UsersReducer,
    feedbacks: FeedbacksReducer,
    map_view: MapViewReducer,
    dashboard: DashboardReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;

type RootState = ReturnType<typeof store["getState"]>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
