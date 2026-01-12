import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'login' | 'activity' | 'ai_insight' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export const useNotifications = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      
      clearNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      
      clearAll: () => {
        set({ notifications: [] });
      },
      
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'alphaforce-notifications',
      // Handle date serialization
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.notifications = state.notifications.map((n) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
        }
      },
    }
  )
);

// Helper function to add common notifications
export const notifyLogin = () => {
  const { addNotification } = useNotifications.getState();
  addNotification({
    type: 'login',
    title: 'Welcome back!',
    message: 'Saul Goodman has logged in successfully.',
  });
};

export const notifyActivityLogged = (clientName: string, activityType: string) => {
  const { addNotification } = useNotifications.getState();
  addNotification({
    type: 'activity',
    title: 'Activity Logged',
    message: `${activityType} activity logged for ${clientName}.`,
  });
};

export const notifyAIInsight = (insightTitle: string) => {
  const { addNotification } = useNotifications.getState();
  addNotification({
    type: 'ai_insight',
    title: 'AI Insight Generated',
    message: insightTitle,
  });
};
