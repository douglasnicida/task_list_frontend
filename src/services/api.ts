import axios from "axios";

const api = axios.create({ 
    baseURL: "https://task-list-backend.fly.dev"
});
export default api;
