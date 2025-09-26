import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { authService } from "../business/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      const user = authService.login({ username, password });
      alert("Login successful!");

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(user));
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <div className="flex flex-col gap-4">
          <InputField
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button text="Login" onClick={handleLogin} />
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleRegister}
              className="text-blue-500 font-semibold hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
