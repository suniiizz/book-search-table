import axios from "axios";

const config = {
  baseURL: "",
  withCredentials: true,
};

const http = axios.create(config);

export default http;
