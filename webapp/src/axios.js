import axios from "axios";

const Axios = axios.create({
  baseURL: "http://192.168.1.96:8000/api",
  withCredentials: true,
});

export default Axios;
