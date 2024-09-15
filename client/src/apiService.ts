import axios from "axios";

// Define the base URL for API requests
const API_BASE_URL = "https://r6z95h-5000.csb.app/api/v1";

// Create an axios instance
const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define the function to register a user
export const registerUser = (data: {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phoneNumber: string;
}) => apiService.post("/auth/register", data);

// Define the function to log in a user
export const loginUser = (data: { email: string; password: string }) =>
  apiService.post("/auth/login", data);

export default apiService;
