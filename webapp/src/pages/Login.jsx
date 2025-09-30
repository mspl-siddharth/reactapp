import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { login } from "../store/userSlice";
import { authService } from "../business/authService";

const Login = () => {
  const [data, setData] = useState({ email: "aa", password: "a" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const { user, token, message } = await authService.login({
        email: data.email,
        password: data.password,
      });
      dispatch(login({ user, token }));
      toast.success(message);
      setData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed!");
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
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          />
          <InputField
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
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
