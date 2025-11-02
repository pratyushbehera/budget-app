import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import appReducer from "./appSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
