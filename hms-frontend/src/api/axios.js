import axios from 'axios';

const api = axios.create({
    // Change 8080 to 8083
    baseURL: 'http://localhost:8083/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Also ensure your interceptor is still there to attach the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;