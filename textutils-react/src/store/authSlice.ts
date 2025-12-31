import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { loginService } from "../services/authService";
import type { User } from "../types/models";
import { emitLogoutEvent } from "../utils/authEvents";

type AuthState = {
  user: User | null;
  permissions: string[];
  token: string | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  permissions: JSON.parse(localStorage.getItem("permissions") || "[]"),
  token: localStorage.getItem("token"),
  loading: false,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await loginService(data.email, data.password);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    localStorage.clear();
    emitLogoutEvent(); // 🔥 notify all tabs
    return true;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setPermissions(
      state,
      action: PayloadAction<string[]>
    ) {
      state.permissions = action.payload;
      localStorage.setItem(
        "permissions",
        JSON.stringify(action.payload)
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
        state.token = action.payload.token;

        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );
        localStorage.setItem(
          "permissions",
          JSON.stringify(action.payload.permissions)
        );
        localStorage.setItem(
          "token",
          action.payload.token
        );
      })
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.permissions = [];
        state.token = null;
      });
  },
});

export const { setPermissions } = authSlice.actions;
export default authSlice.reducer;
