import axios from './axios';

export const notifications = {
    list: (params?: any) => axios.get('/notifications', { params }),
    unreadCount: () => axios.get('/notifications/unread-count'),
    markAsRead: (notificationId?: number) => axios.post('/notifications/mark-read', { notification_id: notificationId }),
    markAllAsRead: () => axios.post('/notifications/mark-all-read'),
    delete: (id: number) => axios.delete(`/notifications/${id}`),
    deleteAll: () => axios.delete('/notifications'),
    types: () => axios.get('/notifications/types'),
};