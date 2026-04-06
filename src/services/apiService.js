/**
 * API service for making HTTP requests to the backend
 */
import { BASE_URL, API_ENDPOINTS } from '../config/api';

/**
 * Helper function to handle fetch requests
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data or error
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}




// Auth API
export const authAPI = {
  login: (credentials) => fetchAPI(`${API_ENDPOINTS.auth}/login`, { method: 'POST', body: JSON.stringify(credentials) }),

};

// Export base URL and endpoints for direct use if needed
export { BASE_URL, API_ENDPOINTS };

// Placeholder endpoints - replace with actual API when available
