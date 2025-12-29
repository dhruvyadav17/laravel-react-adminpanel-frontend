import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../services/userService";

type UserState = {
  list: any[];
  loading: boolean;
};

const initialState: UserState = {
  list: [],
  loading: false,
};

export const fetchUsersThunk = createAsyncThunk(
  "users/fetch",
  async () => {
    const res = await getUsers();
    return res.data.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
