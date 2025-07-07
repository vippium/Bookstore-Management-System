import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if needed
  withCredentials: false,
});

export default api;
