// API Configuration
const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  // User endpoints
  USER_REGISTER: `${API_BASE_URL}/users/`,
  USER_LOGIN: `${API_BASE_URL}/users/authenticate/`,
  
  // Project endpoints  
  PROJECTS: `${API_BASE_URL}/project/`,
  
  // Endpoint management
  ENDPOINTS: `${API_BASE_URL}/endpoints`,
  
  // Sharing
  SHARE: `${API_BASE_URL}/share/`,
  
  // WebSocket
  WS_BASE: 'ws://localhost:8000/ws'
};

export default API_BASE_URL;