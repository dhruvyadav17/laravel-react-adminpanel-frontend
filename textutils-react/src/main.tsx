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

import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


/* ===== AdminLTE 3 CSS ===== */
//import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "admin-lte/dist/css/adminlte.min.css";

/* ===== AdminLTE 3 JS ===== */
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/js/adminlte.min.js";


setStore(store);

/* 🔥 MULTI-TAB LOGOUT SYNC */
listenAuthEvents(() => {
  store.dispatch(logoutThunk());
  window.location.href = "/login";
});

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
              pauseOnHover
              closeOnClick
            />
          </AppModalProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
