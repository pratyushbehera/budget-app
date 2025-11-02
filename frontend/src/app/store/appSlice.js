import { createSlice } from "@reduxjs/toolkit";
import { getCurrentMonth } from "../../shared/utils/getCurrentMonth";

const appSlice = createSlice({
  name: "app",
  initialState: {
    loading: false,
    error: null,
    sidebarOpen: true,
    selectedMonth: getCurrentMonth(),
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  toggleSidebar,
  setSelectedMonth,
} = appSlice.actions;
export default appSlice.reducer;
