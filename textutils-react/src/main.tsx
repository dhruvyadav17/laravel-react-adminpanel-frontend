import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";
import { setStore } from "./store/storeAccessor";
import { AppModalProvider } from "./context/AppModalContext";

import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
setStore(store);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 🔴 Redux outermost */}
    <Provider store={store}>
      {/* 🔥 Router MUST wrap AppRoutes */}
      <BrowserRouter>
        {/* 🔥 Global Modal Context */}
        <AppModalProvider>
          <App />

          {/* 🔔 Toast works globally */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            closeOnClick
          />
        </AppModalProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
