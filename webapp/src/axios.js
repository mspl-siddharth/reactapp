import axios from "axios";

const Axios = axios.create({
  baseURL: "http://192.168.10.113:8000/api",
  withCredentials: true,
});

export default Axios;
