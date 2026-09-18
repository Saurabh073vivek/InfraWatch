import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

// ==========================================
// RESTORE JWT BEFORE REACT STARTS
// ==========================================

const savedToken =
  localStorage.getItem("infrawatch_token");

if (savedToken) {
  axios.defaults.headers.common.Authorization =
    `Bearer ${savedToken}`;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);