import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useNotificationStore = create(
  devtools(
    (set, get) => ({
      // State
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      // Actions
      setNotifications: (notifications) => 
        set({ 
          notifications,
          unreadCount: notifications.filter(n => !n.read_at).length 
        }, false, 'setNotifications'),

      addNotification: (notification) => 
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: notification.read_at ? state.unreadCount : state.unreadCount + 1
        }), false, 'addNotification'),

      markAsRead: (notificationId) => 
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }), false, 'markAsRead'),

      markAllAsRead: () => 
        set((state) => ({
          notifications: state.notifications.map(n => ({ 
            ...n, 
            read_at: n.read_at || new Date().toISOString() 
          })),
          unreadCount: 0
        }), false, 'markAllAsRead'),

      removeNotification: (notificationId) => 
        set((state) => {
          const notification = state.notifications.find(n => n.id === notificationId);
          const wasUnread = notification && !notification.read_at;
          
          return {
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          };
        }, false, 'removeNotification'),

      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

      setError: (error) => set({ error }, false, 'setError'),

      clearError: () => set({ error: null }, false, 'clearError'),

      // Computed
      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(n => !n.read_at);
      },

      getRecentNotifications: (limit = 5) => {
        const { notifications } = get();
        return notifications.slice(0, limit);
      },

      // Reset
      reset: () => 
        set({
          notifications: [],
          unreadCount: 0,
          isLoading: false,
          error: null,
        }, false, 'reset'),
    }),
    {
      name: 'notification-store',
    }
  )
);