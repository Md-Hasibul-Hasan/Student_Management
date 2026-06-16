

import { createAsyncThunk } from "@reduxjs/toolkit";

const url = "https://jsonplaceholder.typicode.com/users";


export const fetchUsers = createAsyncThunk(
  "counter/fetchUsers",

  async () => {
    const response = await fetch(url);

    return await response.json();
  }
);

// returns: state.error = action.error.message




//  With custom error message
export const fetchUsers2 = createAsyncThunk(
  "users/fetchUsers2",

  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(url);

      return await response.json();

    } catch (error) {
      return rejectWithValue(
        error.message
      );
    }
  }
);

// returns: state.error = action.payload