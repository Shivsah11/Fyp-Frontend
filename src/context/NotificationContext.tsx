import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Interface representing a notification object inside the system.
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking_approved';
  bookingId?: string;
  link?: string;
}

/**
 * Interface representing the structure of the Notification Context state and helper functions.
 */
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// Create the context with undefined as initial value, which will be populated by the provider
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Notification Provider Component.
 * Manages fetching notifications from the backend, polling for new updates,
 * filtering duplicate notifications, and managing read/delete states.
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode; userType: 'tenant' | 'landlord' | 'Admin' }> = ({ children, userType }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Loads notifications from the backend API, maps data fields,
   * and filters duplicates before updating the react state.
   */
  const loadNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Note: We do not set loading state during background polling to prevent UI flickers.
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Map backend '_id' to frontend 'id' for compatibility
        const mapped = result.data.map((n: any) => ({
          ...n,
          id: n._id || n.id // Ensure ID exists
        }));
        
        // Filter out duplicate notifications by checking both the unique ID
        // and matching combination of title + message + timestamp.
        const uniqueNotifications = mapped.filter((v: any, i: number, a: any[]) => 
          a.findIndex(t => 
            t.id === v.id || 
            (t.title === v.title && t.message === v.message && t.timestamp === v.timestamp)
          ) === i
        );
        
        setNotifications(uniqueNotifications);
      }
    } catch (e) {
      console.error('Failed to load notifications from backend', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Effect hook to fetch notifications on component mount and set up
   * background polling every 5 seconds to keep the application fully connected.
   */
  useEffect(() => {
    loadNotifications();
    
    // Setup interval to poll for new notifications from the backend
    const intervalId = setInterval(() => {
      loadNotifications();
    }, 5000);
    
    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [loadNotifications]);

  /**
   * Marks a single notification as read by sending a PATCH request to the backend.
   * Performs an optimistic update on the local state for a responsive UI feel.
   */
  const markAsRead = async (id: string) => {
    // Optimistically update the UI to avoid lag
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (e) {
      console.error('Failed to mark notification as read', e);
    }
  };

  /**
   * Marks all notifications as read in the backend.
   * Performs an optimistic update on the local state.
   */
  const markAllAsRead = async () => {
    // Optimistically update the UI to avoid lag
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (e) {
      console.error('Failed to mark all as read', e);
    }
  };

  /**
   * Deletes all notifications for the user from the backend.
   * Performs an optimistic update on the local state.
   */
  const clearAll = async () => {
    // Optimistically update the UI to avoid lag
    setNotifications([]);

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/notifications', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (e) {
      console.error('Failed to clear notifications', e);
    }
  };

  /**
   * Programmatically adds a local/UI-driven notification to the top of the list.
   */
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNoti: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNoti, ...notifications]);
  };

  // Compute unread count from local notifications list
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom React Hook to consume the Notification Context state and methods.
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
