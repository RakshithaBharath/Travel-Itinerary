// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8090/api", // Replace with your backend base URL
});

// Interceptor to add Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // store token on login
    console.log(localStorage.getItem("token"));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(localStorage.getItem("token"));
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
