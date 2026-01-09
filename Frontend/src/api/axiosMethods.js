import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

const refreshApi = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

const refreshAccessToken = async () => {
    const response = await refreshApi.post("auth/refresh-token");
    return response.data.accessToken;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
};


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
    async (error) => {
        const originalRequest = error.config;

        // Access token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // wait for refresh to complete
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: (err) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const newAccessToken = await refreshAccessToken();
                sessionStorage.setItem("access", newAccessToken);

                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                sessionStorage.clear();
                window.location.href = "/";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
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
    const response = await api.post(url, data, config);
    return response;
}

export const put = async (url, data, config) => {
    const response = await api.put(url, data, config);
    return response;
}

export const del = async (url, config) => {
    const response = api.delete(url, config);
    return response;
}