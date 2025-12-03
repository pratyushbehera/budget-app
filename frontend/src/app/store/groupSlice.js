import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: null,
  loading: true,
  error: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroup: (state, action) => {
      state.groups = action.payload;
      state.loading = false;
    },
  },
});

export const { setGroup } = groupSlice.actions;

export default groupSlice.reducer;
