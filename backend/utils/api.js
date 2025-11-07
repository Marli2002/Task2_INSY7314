import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000/api';

// Cache for CSRF token
let cachedCsrfToken = null;
let tokenTimestamp = null;
const TOKEN_LIFETIME = 55 * 60 * 1000; // 55 minutes (token expires in 1 hour)

/**
 * Get CSRF token from server
 * Caches token to avoid unnecessary requests
 */
async function getCsrfToken() {
  // Return cached token if still valid
  if (cachedCsrfToken && tokenTimestamp && 
      (Date.now() - tokenTimestamp < TOKEN_LIFETIME)) {
    return cachedCsrfToken;
  }
  
  try {
    const response = await axios.get(`${API_URL}/csrf-token`, {
      withCredentials: true
    });
    
    cachedCsrfToken = response.data.csrfToken;
    tokenTimestamp = Date.now();
    
    return cachedCsrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    throw new Error('Could not retrieve CSRF token');
  }
}

/**
 * Clear cached CSRF token (useful after logout or token error)
 */
export function clearCsrfToken() {
  cachedCsrfToken = null;
  tokenTimestamp = null;
}

/**
 * Make API request with automatic CSRF token handling
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {object} options - Axios request options
 * @returns {Promise} - Axios response
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  // Get CSRF token for state-changing methods
  const method = options.method?.toUpperCase() || 'GET';
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    try {
      const csrfToken = await getCsrfToken();
      
      // Add CSRF token to headers
      options.headers = {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
        ...options.headers
      };
    } catch (error) {
      throw new Error('CSRF token required but could not be obtained');
    }
  }
  
  // Always include credentials for cookies
  options.withCredentials = true;
  
  try {
    const response = await axios({
      url,
      ...options
    });
    
    return response;
  } catch (error) {
    // Handle CSRF token errors
    if (error.response?.status === 403 && 
        error.response?.data?.error === 'CSRF_TOKEN_INVALID') {
      console.warn('CSRF token invalid, retrying with new token...');
      
      // Clear cached token and retry once
      clearCsrfToken();
      const newToken = await getCsrfToken();
      options.headers['CSRF-Token'] = newToken;
      
      return axios({
        url,
        ...options
      });
    }
    
    throw error;
  }
}

/**
 * Convenience methods for common HTTP operations
 */
export const api = {
  /**
   * GET request
   */
  get: (endpoint, config = {}) => {
    return apiRequest(endpoint, {
      ...config,
      method: 'GET'
    });
  },
  
  /**
   * POST request with CSRF protection
   */
  post: (endpoint, data, config = {}) => {
    return apiRequest(endpoint, {
      ...config,
      method: 'POST',
      data
    });
  },
  
  /**
   * PUT request with CSRF protection
   */
  put: (endpoint, data, config = {}) => {
    return apiRequest(endpoint, {
      ...config,
      method: 'PUT',
      data
    });
  },
  
  /**
   * PATCH request with CSRF protection
   */
  patch: (endpoint, data, config = {}) => {
    return apiRequest(endpoint, {
      ...config,
      method: 'PATCH',
      data
    });
  },
  
  /**
   * DELETE request with CSRF protection
   */
  delete: (endpoint, config = {}) => {
    return apiRequest(endpoint, {
      ...config,
      method: 'DELETE'
    });
  }
};

/**
 * Helper to add auth token to request headers
 */
export function withAuthToken(config = {}) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    ...config,
    headers: {
      'x-auth-token': token,
      ...config.headers
    }
  };
}

/*
References:

Axios. (n.d.). Axios API documentation. Retrieved November 7, 2025, 
from https://axios-http.com/docs/api_intro

Mozilla Developer Network (MDN). (n.d.). Using the Fetch API. Retrieved November 7, 2025,
from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

OWASP Foundation. (n.d.). Cross-Site Request Forgery Prevention Cheat Sheet.
Retrieved November 7, 2025, from https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
*/