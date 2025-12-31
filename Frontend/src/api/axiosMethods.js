import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized – redirect to login");
            // optional:
            // sessionStorage.clear();
            // window.location.href = "/login";
        }

        if (error.response?.status === 500) {
            console.error("Server error");
        }

        return Promise.reject(error);
    }
);

export const get = async (url, config) => {
    const response = await api.get(url, config);
    return response;
}

export const post = async (url, data, config) => {
    const response = await api.post(url, data, { ...config });
    return response;
}

export const put = async (url, data, config) => {
    const response = await api.put(url, data, { ...config });
    return response;
}

export const del = async (url, config) => {
    const response = api.delete(url, config);
    return response;
}