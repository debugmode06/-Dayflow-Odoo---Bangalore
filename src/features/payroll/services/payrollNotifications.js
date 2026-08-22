/**
 * Local UI Notification Service for Payroll events
 */

const NOTIFICATION_KEY = 'dayflow_payroll_notifications';

export const payrollNotificationService = {
  getNotifications() {
    try {
      const stored = localStorage.getItem(NOTIFICATION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addNotification(type, title, message, targetUserId = 'ALL') {
    try {
      const existing = this.getNotifications();
      const newNotif = {
        id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type, // PAYROLL_CALCULATED | PAYROLL_APPROVED | PAYROLL_PAID | PAYSLIP_AVAILABLE
        title,
        message,
        targetUserId,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const updated = [newNotif, ...existing].slice(0, 50); // Keep last 50
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
      return newNotif;
    } catch (err) {
      console.warn('Failed to save notification:', err);
      return null;
    }
  },

  markAllAsRead() {
    try {
      const existing = this.getNotifications();
      const updated = existing.map((n) => ({ ...n, read: true }));
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to mark notifications read:', err);
    }
  },
};
