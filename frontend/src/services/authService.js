import api from './api'; // <-- IMPORT OUR NEW HELPER

// The base URL is already in api.js, so we just need the path
const API_URL = '/auth';

// Login user
const login = async (email, password) => {
  // Use 'api' instead of 'axios'
  const response = await api.post(`${API_URL}/login`, {
    email,
    password,
  });

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Register user
const register = async (name, email, password) => {
  // Use 'api' instead of 'axios'
  const response = await api.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

// --- NEW FUNCTION ---
// Get user profile
const getProfile = async () => {
  // This sends the token in the header automatically!
  const response = await api.get(`${API_URL}/profile`);
  return response.data;
};
// --- END NEW FUNCTION ---

const authService = {
  login,
  register,
  logout,
  getProfile, // <-- Export the new function
};

export default authService;