import axios from "axios";

const api = axios.create({ 
    baseURL: "https://task-list-backend-wa60.onrender.com"
});
export default api;
