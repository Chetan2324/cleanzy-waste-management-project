import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cleanzy-waste-management-backend.onrender.com/api', // Our base API URL
});

// This is an "interceptor"
// It runs BEFORE every request is sent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the x-auth-token header we created in our backend
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;