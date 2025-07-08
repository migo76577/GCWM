import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} role - User role (admin, customer, driver)
 */

/**
 * Simple authentication store with persistence
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => {
        console.log('🔑 Setting auth:', { user: user?.name, hasToken: !!token });
        
        set({ 
          user, 
          token, 
          isAuthenticated: !!(user && token)
        });
      },

      clearAuth: () => {
        console.log('🚪 Clearing auth');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      // Helper methods
      isAdmin: () => get().user?.role === 'admin',
      isCustomer: () => get().user?.role === 'customer',
      isDriver: () => get().user?.role === 'driver',
      hasRole: (role) => get().user?.role === role,

      // Get current token
      getToken: () => {
        const state = get();
        return state.token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Make store available globally for axios
if (typeof window !== 'undefined') {
  window.__AUTH_STORE__ = useAuthStore;
  console.log('🌐 Auth store made globally available');
}