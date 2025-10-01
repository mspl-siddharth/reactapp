import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { login, logout } from "./store/userSlice";
import { authService } from "./business/authService";
import Demo from "./pages/Demo";

function App() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      if (token && !userData.user) {
        try {
          const user = await authService.getCurrentUser(token);
          dispatch(login({ user, token }));
        } catch (err) {
          dispatch(logout());
          authService.logout();
          setAuthError("Token error: Invalid or expired token");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [userData.user, dispatch]);

  useEffect(() => {
    const handleNativeMessage = (event) => {
      console.log("native msg:", event.data);
      if (event.data.type === "AUTH_FAILED") {
        localStorage.clear();
        alert("Biometric failed, clearing storage");
      }
    };

    window.addEventListener("message", handleNativeMessage);
    return () => window.removeEventListener("message", handleNativeMessage);
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  if (authError)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        {authError}
      </div>
    );

  return (
    <Routes>
      <Route
        path="/"
        element={
          authService.isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          authService.isAuthenticated() ? (
            <Dashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  );
}

export default App;
