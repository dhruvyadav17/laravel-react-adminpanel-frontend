import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import { setStore } from "./storeAccessor";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
});

// 🔥 inject store AFTER creation
setStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
