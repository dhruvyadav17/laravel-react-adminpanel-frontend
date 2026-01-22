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

type AuthState = {
  user: User | null;
  permissions: string[];
  token: string | null;
  loading: boolean;
};

/* ================= INITIAL STATE ================= */
/* Rehydration from localStorage */

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  permissions: JSON.parse(
    localStorage.getItem("permissions") || "[]"
  ),
  token: localStorage.getItem("token"),
  loading: false,
};

/* ================= THUNKS ================= */

/**
 * LOGIN
 * -------------------------------------------------
 * - Authenticate only
 * - Store ONLY token
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await loginService(
        data.email,
        data.password
      );

      // expected: { token }
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message ||
          "Invalid credentials"
      );
    }
  }
);

/**
 * PROFILE
 * -------------------------------------------------
 * - Single source of truth
 * - user + permissions
 */
export const fetchProfileThunk = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await profileService();

      // expected: { user, permissions }
      return res.data.data;
    } catch {
      return rejectWithValue("Failed to load profile");
    }
  }
);

/**
 * LOGOUT
 * -------------------------------------------------
 * - Clear storage
 * - Multi-tab sync
 */
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
    /**
     * OPTIONAL
     * -------------------------------------------------
     * Keep ONLY if you need manual override (testing/tools)
     * Otherwise safe to remove.
     */
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
      /* ================= LOGIN ================= */

      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })

      /* LOGIN SUCCESS → ONLY TOKEN */
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;

        localStorage.setItem(
          "token",
          action.payload.token
        );
      })

      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
      })

      /* ================= PROFILE ================= */

      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;

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
      })

      /* ================= LOGOUT ================= */

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.permissions = [];
        state.token = null;
        state.loading = false;
      });
  },
});

/* ================= EXPORTS ================= */

export const { setPermissions } =
  authSlice.actions;

export default authSlice.reducer;
