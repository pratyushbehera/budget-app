import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: null,
  loading: true,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.loading = false;
    },
  },
});

export const { setCategory } = categorySlice.actions;

export default categorySlice.reducer;
