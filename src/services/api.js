import axios from "axios";
import {jwtDecode} from "jwt-decode";

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL;
const MESSAGING_SERVICE_URL = process.env.REACT_APP_MESSAGING_SERVICE_URL;

//Function to decode JWT and get user info
export const getUserInfoFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      UserId: decoded.UserId || decoded.id || decoded.sub, 
      FullName: decoded.FullName || decoded.name || "Unknown User",
    };
  } catch (error) {
    console.error(" Error decoding token:", error);
    return null;
  }
};

// Register user
export const registerUser = async (fullName, email, password) => {
  console.log(`${USER_SERVICE_URL}/api/auth/register`);
  console.log({ fullName, email, password });
  return axios.post(`${USER_SERVICE_URL}/api/auth/register`, { fullName, email, password });
};

// Login user
export const loginUser = async (email, password) => {
  const response = await axios.post(`${USER_SERVICE_URL}/api/auth/login`, { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

// Get user profile
export const getUserProfile = async () => {
  return axios.get(`${USER_SERVICE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};

// Send chat message
export const sendMessage = async (payload) => {
  return axios.post(`${MESSAGING_SERVICE_URL}/api/messages/send`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};


// fetch users
export const fetchUsers = async () =>{
  const response = await axios.get(`${USER_SERVICE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  const userList = Array.isArray(response.data) ? response.data : response.data.users;
  return userList;
}
