import { toast } from "react-toastify";
import Axios from "../axios";

export const authService = {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error("all fields are required");
    }

    const response = await Axios.post("/auth/register", {
      name,
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("email and password are required");
    }

    const response = await Axios.post("/auth/login", { email, password });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    const { token, userData, message } = response.data;

    const user = {
      userId: userData._id,
      name: userData.name,
      email: userData.email,
    };

    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "LOGIN_SUCCESS",
        user,
        token,
      })
    );

    localStorage.setItem("token", JSON.stringify(token));
    return { user, token, message };
  },

  async getCurrentUser(token) {
    const response = await Axios.post("/auth/get-current-user", { token });

    if (!response.data.success) {
      throw new Error("failed to fetch user data");
    }
    console.log(response);
    return response.data.user;
  },

  logout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "LOGOUT",
      })
    );
  },

  getToken() {
    let token = JSON.parse(localStorage.getItem("token"));
    return token;
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },
};
