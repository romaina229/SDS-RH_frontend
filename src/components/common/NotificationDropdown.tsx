import React, { useState, useEffect, useRef } from 'react';
import { notifications } from '../../api/notifications';
import toast from 'react-hot-toast';
import {
    BellIcon,
    CheckIcon,
    XMarkIcon,
    TrashIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    UserPlusIcon,
    DocumentIcon,
    CalendarIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface NotificationItem {
    id: number;
    type: string;
    title: string;
    message: string;
    status: 'read' | 'unread';
    created_at: string;
    read_at?: string;
    link?: string;
}

interface NotificationDropdownProps {
    onNotificationClick?: (notification: NotificationItem) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNotificationClick }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await notifications.unreadCount();
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Erreur chargement compteur', error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notifications.list({ per_page: 20 });
            setNotificationsList(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id?: number) => {
        try {
            if (id) {
                await notifications.markAsRead(id);
                setNotificationsList(prev => 
                    prev.map(n => n.id === id ? { ...n, status: 'read', read_at: new Date().toISOString() } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                await notifications.markAllAsRead();
                setNotificationsList(prev => 
                    prev.map(n => ({ ...n, status: 'read', read_at: new Date().toISOString() }))
                );
                setUnreadCount(0);
                toast.success('Toutes les notifications ont été lues');
            }
        } catch (error) {
            toast.error('Erreur lors du marquage');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await notifications.delete(id);
            setNotificationsList(prev => prev.filter(n => n.id !== id));
            if (notificationsList.find(n => n.id === id)?.status === 'unread') {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            toast.success('Notification supprimée');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('Supprimer toutes les notifications ?')) return;
        try {
            await notifications.deleteAll();
            setNotificationsList([]);
            toast.success('Toutes les notifications supprimées');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            leave_approved: CheckCircleIcon,
            leave_rejected: XMarkIcon,
            leave_requested: CalendarIcon,
            contract_expiring: ExclamationCircleIcon,
            contract_created: DocumentIcon,
            contract_amended: DocumentIcon,
            employee_added: UserPlusIcon,
            payroll_processed: CurrencyDollarIcon,
            payroll_paid: CheckCircleIcon,
            attendance_clock_in: CheckIcon,
            attendance_clock_out: XMarkIcon,
            training_enrolled: CheckCircleIcon,
            training_completed: CheckCircleIcon,
            recruitment_new: UserPlusIcon,
            recruitment_status: InformationCircleIcon,
            system: InformationCircleIcon,
        };
        return icons[type] || InformationCircleIcon;
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            leave_approved: 'text-green-600 bg-green-50',
            leave_rejected: 'text-red-600 bg-red-50',
            leave_requested: 'text-yellow-600 bg-yellow-50',
            contract_expiring: 'text-orange-600 bg-orange-50',
            contract_created: 'text-blue-600 bg-blue-50',
            contract_amended: 'text-purple-600 bg-purple-50',
            employee_added: 'text-indigo-600 bg-indigo-50',
            payroll_processed: 'text-cyan-600 bg-cyan-50',
            payroll_paid: 'text-green-600 bg-green-50',
            attendance_clock_in: 'text-green-600 bg-green-50',
            attendance_clock_out: 'text-red-600 bg-red-50',
            training_enrolled: 'text-blue-600 bg-blue-50',
            training_completed: 'text-green-600 bg-green-50',
            recruitment_new: 'text-pink-600 bg-pink-50',
            recruitment_status: 'text-gray-600 bg-gray-50',
            system: 'text-gray-600 bg-gray-50',
        };
        return colors[type] || 'text-gray-600 bg-gray-50';
    };

    const getTimeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}j`;
        return new Date(date).toLocaleDateString('fr-FR');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center space-x-2">
                            {notificationsList.some(n => n.status === 'unread') && (
                                <button
                                    onClick={() => handleMarkAsRead()}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Tout marquer lu
                                </button>
                            )}
                            {notificationsList.length > 0 && (
                                <button
                                    onClick={handleDeleteAll}
                                    className="text-xs text-gray-500 hover:text-red-600 font-medium"
                                >
                                    Supprimer tout
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[400px]">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-4 border-primary-200 border-t-primary-600"></div>
                            </div>
                        ) : notificationsList.length === 0 ? (
                            <div className="text-center py-8">
                                <BellIcon className="h-12 w-12 text-gray-300 mx-auto" />
                                <p className="mt-2 text-gray-500">Aucune notification</p>
                            </div>
                        ) : (
                            notificationsList.map((notification) => {
                                const Icon = getTypeIcon(notification.type);
                                const colorClass = getTypeColor(notification.type);
                                return (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${notification.status === 'unread' ? 'bg-blue-50/50' : ''}`}
                                        onClick={() => {
                                            if (notification.status === 'unread') {
                                                handleMarkAsRead(notification.id);
                                            }
                                            if (notification.link) {
                                                window.location.href = notification.link;
                                            }
                                            if (onNotificationClick) {
                                                onNotificationClick(notification);
                                            }
                                        }}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorClass}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <p className={`text-sm font-medium ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                        {getTimeAgo(notification.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`text-xs px-1.5 py-0.5 rounded ${notification.status === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {notification.status === 'unread' ? 'Non lu' : 'Lu'}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(notification.id);
                                                        }}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <TrashIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {notificationsList.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                            <button
                                onClick={fetchNotifications}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Rafraîchir
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;