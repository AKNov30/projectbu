let apiUrl;

if (import.meta.env.VITE_API_URL) {
    apiUrl = import.meta.env.VITE_API_URL;
} else {
    apiUrl = 'http://localhost:5000';
}

const API_URL = apiUrl;

export default API_URL;
