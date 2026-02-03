import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  loginService,
  profileService,
} from "../services/authService";

import type { User } from "../types/models";
import { emitLogoutEvent } from "../utils/authEvents";

/* ================= TYPES ================= */

export type AuthState = {
  user: User | null;
  permissions: string[];
  token: string | null;
  loading: boolean;
  forcePasswordReset: boolean;
};

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })(),

  permissions: (() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]");
    } catch {
      return [];
    }
  })(),

  token: localStorage.getItem("token"),
  loading: false,
  forcePasswordReset: false,
};

/* ================= THUNKS ================= */

export const loginThunk = createAsyncThunk<
  { token: string; force_password_reset: boolean },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await loginService(data.email, data.password);
    return res.data.data;
  } catch (e: any) {
    return rejectWithValue(
      e.response?.data?.message || "Invalid credentials"
    );
  }
});

export const fetchProfileThunk = createAsyncThunk<
  {
    user: User;
    permissions: string[];
    force_password_reset: boolean;
  },
  void,
  { rejectValue: string }
>("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const res = await profileService();
    return res.data.data;
  } catch {
    return rejectWithValue("Failed to load profile");
  }
});

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    localStorage.clear();
    emitLogoutEvent();
    return true;
  }
);

/* ================= SLICE ================= */

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

      /* LOGIN */
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.forcePasswordReset =
          action.payload.force_password_reset;

        localStorage.setItem(
          "token",
          action.payload.token
        );
      })

      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
      })

      /* PROFILE */
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
        state.forcePasswordReset =
          action.payload.force_password_reset;

        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );

        localStorage.setItem(
          "permissions",
          JSON.stringify(action.payload.permissions)
        );
      })

      .addCase(fetchProfileThunk.rejected, (state) => {
        state.user = null;
        state.permissions = [];
        state.forcePasswordReset = false;
      })

      /* LOGOUT */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.permissions = [];
        state.token = null;
        state.loading = false;
        state.forcePasswordReset = false;
      });
  },
});

export const { setPermissions } = authSlice.actions;
export default authSlice.reducer;
