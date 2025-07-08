import axios from 'axios';

class ApiService {
  constructor(baseURL = '/api/v1') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to this instance to get token from auth store
    this.api.interceptors.request.use(
      (config) => {
        let token = null;
        
        // Try to get token from auth store
        if (window.__AUTH_STORE__) {
          const state = window.__AUTH_STORE__.getState();
          token = state.token;
        }
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for better error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 errors by clearing auth store
        if (error.response?.status === 401 && window.__AUTH_STORE__) {
          window.__AUTH_STORE__.getState().clearAuth();
        }
        
        const customError = this.handleError(error);
        return Promise.reject(customError);
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return {
            type: 'UNAUTHORIZED',
            message: 'Authentication required. Please log in.',
            status,
            data,
          };
        case 403:
          return {
            type: 'FORBIDDEN',
            message: 'Access denied. You do not have permission to perform this action.',
            status,
            data,
          };
        case 422:
          return {
            type: 'VALIDATION_ERROR',
            message: 'Validation failed. Please check your input.',
            status,
            data,
            errors: data.errors || {},
          };
        case 500:
          return {
            type: 'SERVER_ERROR',
            message: 'Internal server error. Please try again later.',
            status,
            data,
          };
        default:
          return {
            type: 'HTTP_ERROR',
            message: data.message || 'An error occurred.',
            status,
            data,
          };
      }
    } else if (error.request) {
      // Network error
      return {
        type: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        error,
      };
    } else {
      // Something else happened
      return {
        type: 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred.',
        error,
      };
    }
  }

  // Generic CRUD methods
  async get(endpoint, config = {}) {
    const response = await this.api.get(endpoint, config);
    return response.data;
  }

  async post(endpoint, data = {}, config = {}) {
    const response = await this.api.post(endpoint, data, config);
    return response.data;
  }

  async put(endpoint, data = {}, config = {}) {
    const response = await this.api.put(endpoint, data, config);
    return response.data;
  }

  async patch(endpoint, data = {}, config = {}) {
    const response = await this.api.patch(endpoint, data, config);
    return response.data;
  }

  async delete(endpoint, config = {}) {
    const response = await this.api.delete(endpoint, config);
    return response.data;
  }
}

export default new ApiService();