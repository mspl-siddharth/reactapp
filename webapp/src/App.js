import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { login } from "./store/userSlice";
import { authService } from "./business/authService";

function App() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token && !userData.user) {
        try {
          const user = await authService.getCurrentUser(token);
          dispatch(login({ user, token }));
        } catch (err) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [userData.user, dispatch]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

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
    </Routes>
  );
}

export default App;
