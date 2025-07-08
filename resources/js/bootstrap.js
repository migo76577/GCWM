import axios from 'axios';

// Global axios instance
window.axios = axios;

// Basic headers
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';

// CSRF token setup
const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
}

// Enable credentials for CORS
window.axios.defaults.withCredentials = true;

// Request interceptor - get token from auth store
window.axios.interceptors.request.use(
    function (config) {
        let token = null;
        
        // Try to get token from auth store first
        if (window.__AUTH_STORE__) {
            const state = window.__AUTH_STORE__.getState();
            token = state.token;
            console.log('🔍 Request interceptor - Auth store state:', { 
                hasToken: !!token, 
                isAuthenticated: state.isAuthenticated,
                user: state.user?.name,
                url: config.url
            });
        } else {
            console.log('⚠️ Auth store not available for request:', config.url);
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Adding token to request:', config.url, token.substring(0, 10) + '...');
        } else {
            console.log('⚠️ No token found for request:', config.url);
        }
        
        return config;
    },
    function (error) {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Simple response interceptor - handle 401 errors
window.axios.interceptors.response.use(
    function (response) {
        console.log('✅ API Response:', response.config.url, response.status);
        return response;
    },
    function (error) {
        console.error('❌ API Error:', error.config?.url, error.response?.status);
        
        if (error.response?.status === 401) {
            console.log('🚪 401 Unauthorized - clearing auth');
            
            // Clear from auth store
            if (window.__AUTH_STORE__) {
                window.__AUTH_STORE__.getState().clearAuth();
            }
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);