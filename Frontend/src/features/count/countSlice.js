import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./countThunk";

const initialState = {
  id: 1,
  value: 10,

  users: [],
  loading: false,
  error: null,
};

export const counterSlice = createSlice({
  name: "sliceCounter",

  initialState: initialState,

  reducers: {
    increment: (state) => {
      state.value += 1;
    },

    decrement: (state) => {
      state.value -= 1;
    },

    customInc: (state, action) => {
      state.value += action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  increment,
  decrement,
  customInc,
} = counterSlice.actions;

export default counterSlice.reducer;
