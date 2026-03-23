import { createSlice } from "@reduxjs/toolkit";
import { getCurrentMonth } from "../../shared/utils/getCurrentMonth";

const appSlice = createSlice({
  name: "app",
  initialState: {
    loading: false,
    error: null,
    sidebarOpen: true,
    dateMode: "month", // "month", "year", "range"
    selectedMonth: getCurrentMonth(),
    startDate: null,
    endDate: null,
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
      state.dateMode = "month";
      state.startDate = null;
      state.endDate = null;
    },
    setDateRange: (state, action) => {
      const { mode, startDate, endDate, month } = action.payload;
      state.dateMode = mode;
      state.startDate = startDate;
      state.endDate = endDate;
      if (month) state.selectedMonth = month;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  toggleSidebar,
  setSelectedMonth,
  setDateRange,
} = appSlice.actions;
export default appSlice.reducer;
