import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";
import { setStore } from "./store/storeAccessor";

import { AppModalProvider } from "./context/AppModalContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

import { listenAuthEvents } from "./utils/authEvents";
import { logoutThunk } from "./store/authSlice";

/* ===================================================
   CSS (ORDER MATTERS)
   =================================================== */
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "admin-lte/dist/css/adminlte.min.css";

/* 🔥 EXACT ADMINLTE 4 DOCS STYLE (SINGLE FILE) */
import "./adminlte-sidebar-fix.css";

/* ===================================================
   JS
   =================================================== */
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/js/adminlte.min.js";

/* ===================================================
   TOAST
   =================================================== */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===================================================
   STORE ACCESS
   =================================================== */
setStore(store);

/* ===================================================
   MULTI-TAB LOGOUT (SYNC)
   =================================================== */
listenAuthEvents(() => {
  store.dispatch(logoutThunk());
  window.location.replace("/login");
});

/* ===================================================
   APP BOOTSTRAP
   =================================================== */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppModalProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </AppModalProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
