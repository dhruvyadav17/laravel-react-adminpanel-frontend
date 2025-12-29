import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService } from "../services/authService";

/* ================= TYPES ================= */
type AuthState = {
  user: any | null;
  permissions: string[];
  token: string | null;
  loading: boolean;
};

/* ================= INITIAL STATE ================= */
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  permissions: JSON.parse(localStorage.getItem("permissions") || "[]"),
  token: localStorage.getItem("token"),
  loading: false,
};

/* ================= LOGIN ================= */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginService(data.email, data.password);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Login failed");
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.clear();
  return true;
});

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* 🔥 BACKEND ALWAYS WINS */
    setPermissions: (state, action) => {
      state.permissions = action.payload;
      localStorage.setItem("permissions", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- LOGIN ---------- */
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem(
          "permissions",
          JSON.stringify(action.payload.permissions)
        );
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
      })

      /* ---------- LOGOUT ---------- */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.permissions = [];
        state.token = null;
      });
  },
});

export const { setPermissions } = authSlice.actions;
export default authSlice.reducer;
