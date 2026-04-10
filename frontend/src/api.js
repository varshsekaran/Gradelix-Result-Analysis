import axios from "axios";

const API = axios.create({
  baseURL: "https://gradelix-backend.onrender.com"
});

export default API;