import React from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Debug component to show auth state - remove in production
 */
export const AuthDebug = () => {
  const { user, token, isAuthenticated, getToken } = useAuthStore();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const currentToken = getToken();
  const localStorageToken = localStorage.getItem('auth_token');

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔍 Auth Debug</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>User: {user?.name || 'None'}</div>
      <div>Role: {user?.role || 'None'}</div>
      <div>Store Token: {token ? `${token.substring(0, 15)}...` : 'None'}</div>
      <div>localStorage: {localStorageToken ? `${localStorageToken.substring(0, 15)}...` : 'None'}</div>
      <div>Current Token: {currentToken ? `${currentToken.substring(0, 15)}...` : 'None'}</div>
      <div className="mt-2 pt-2 border-t border-gray-600">
        <button 
          onClick={() => console.log('Auth State:', { user, token, isAuthenticated, currentToken })}
          className="text-blue-300 underline"
        >
          Log to Console
        </button>
      </div>
    </div>
  );
};