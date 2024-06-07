import axios from "axios";
import Cookies from "js-cookie";

const axiosAdmin = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_DOMAIN_ADMIN
});

// Function to refresh token
const refreshToken = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/refresh-token`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

// Add a request interceptor
axiosAdmin.interceptors.request.use(
    async (config) => {
        // If the request is not to refresh the token, proceed as usual
        if (!config.url.includes('/refresh-token')) {
            // Get token from cookies or storage
            const token = Cookies.get('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosAdmin.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const data = await refreshToken();
                // Save new tokens
                Cookies.set('accessToken', data.accessToken);
                Cookies.set('refreshToken', data.refreshToken);

                // Update the authorization header with the new token
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                // Retry the original request with the new token
                return axiosAdmin(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { axiosAdmin };
