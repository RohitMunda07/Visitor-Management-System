import axios from "axios"

const baseUrl = import.meta.env.VITE_BACKEND_URL;

axios.interceptors.request.use((config) => {
    // Adding token to header
    config.headers.Authorization = `Bearer ${sessionStorage?.getItem('token') || ''}`;
    config.withCredentials = true;
    return config;
}, (error) => {
    if (error.response.status === 401) {
        // Handle unauthorized errors (e.g., redirect to login)
        console.error('Unauthorized access');
    } else if (error.response.status === 500) {
        // Handle server errors
        console.error('Server error');
    }
    return Promise.reject(error);
})

export const get = async (url) => {
    const response = await axios.get(`${baseUrl}` + url);
    return response;
}

export const post = async (url, data, config) => {
    const response = await axios.post(`${baseUrl}` + url, data, { ...config });
    return response;
}

export const put = async (url, data, config) => {
    const response = await axios.put(`${baseUrl}` + url, data, { ...config });
    return response;
}