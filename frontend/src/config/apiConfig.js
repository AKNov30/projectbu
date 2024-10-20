import axios from 'axios';

let apiUrl;

if (import.meta.env.VITE_API_URL) {
    apiUrl = import.meta.env.VITE_API_URL;
} else {
    apiUrl = 'http://localhost:5000';
}

const apiInstance = axios.create({
    baseURL: apiUrl
});

export { apiUrl };
export default apiInstance;
