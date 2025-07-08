import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

/**
 * Custom hook to protect actions based on user roles
 * @param {string} requiredRole - The role required to perform the action
 * @param {string} actionName - Name of the action for error messages
 */
export const useProtectedAction = (requiredRole = 'admin', actionName = 'action') => {
  const { user, hasRole, isAuthenticated } = useAuthStore();

  const executeIfAllowed = (callback) => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      return false;
    }

    if (!hasRole(requiredRole)) {
      toast.error(`You don't have permission to ${actionName}. ${requiredRole} role required.`);
      return false;
    }

    return callback();
  };

  return {
    canExecute: isAuthenticated && hasRole(requiredRole),
    executeIfAllowed,
    user,
    isAuthenticated,
  };
};

// Specific hooks for common actions
export const useAdminAction = (actionName) => useProtectedAction('admin', actionName);
export const useDriverAction = (actionName) => useProtectedAction('driver', actionName);
export const useCustomerAction = (actionName) => useProtectedAction('customer', actionName);