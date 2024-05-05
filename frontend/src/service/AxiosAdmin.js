import axios from "axios";

const axiosAdmin = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_DOMAIN_ADMIN
});

export { axiosAdmin}