// src/config/apiConfig.js
let apiUrl;

if (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) {
    apiUrl = process.env.REACT_APP_API_URL;
} else {
    apiUrl = 'http://localhost:5000';
}

const API_URL = apiUrl;

export default API_URL;
