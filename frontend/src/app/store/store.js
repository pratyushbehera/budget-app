import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import appReducer from "./appSlice";
import categoryReducer from "./categorySlice";
import groupReducer from "./groupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    category: categoryReducer,
    group: groupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
