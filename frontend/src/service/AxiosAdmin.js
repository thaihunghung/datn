import axios from "axios";

const axiosAdmin = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_DOMAIN_ADMIN
});

axiosAdmin.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Gọi endpoint /refresh-token để lấy token mới
                const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/refresh-token`, {}, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    // Lấy token mới từ response
                    const newAccessToken = response.data.accessToken;
                    
                    // Cập nhật header Authorization cho request gốc và thử lại request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosAdmin(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { axiosAdmin };
