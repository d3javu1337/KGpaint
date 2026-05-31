import axios from "axios";
import {AccessToken} from "../model/ApiModel";


export const api_url = 'http://localhost:80/api/v1';
export const gateway_api_url = 'http://localhost:80';


export const api = axios.create({
    baseURL: api_url,
    withCredentials: true,
})

export const storageApi = axios.create({
    withCredentials: true,
})

export const gatewayApi = axios.create({
    baseURL: gateway_api_url,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
})

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AccessToken>(`${gateway_api_url}/auth/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data);
            return api.request(originalRequest)
        } catch (error) {
            console.log(error);
        }
    } else if (error) {
        const message = error.response?.data?.msg || error.response?.data?.reason || error.message || 'Неизвестная ошибка';
        const code = error.response?.status || 500;
        window.location.href = `/error?code=${code}&message=${message}`;
    }
    throw error;
})
