import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { notifications } from '../../api/notifications';
import type { Notification } from '../../types';
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
    EyeIcon,
} from '@heroicons/react/24/outline';

const Notifications: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
    });
    const [filter, setFilter] = useState<string>('all');
    const [] = useState<Notification | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const params: any = { per_page: 20 };
            if (filter === 'unread') {
                params.status = 'unread';
            } else if (filter === 'read') {
                params.status = 'read';
            }
            const response = await notifications.list(params);
            setNotificationsList(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
            });
        } catch (error) {
            toast.error('Erreur lors du chargement des notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notifications.markAsRead(id);
            setNotificationsList(prev =>
                prev.map(n => n.id === id ? { ...n, status: 'read', read_at: new Date().toISOString() } : n)
            );
            toast.success('Notification marquée comme lue');
        } catch (error) {
            toast.error('Erreur lors du marquage');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notifications.markAllAsRead();
            setNotificationsList(prev =>
                prev.map(n => ({ ...n, status: 'read', read_at: new Date().toISOString() }))
            );
            toast.success('Toutes les notifications marquées comme lues');
        } catch (error) {
            toast.error('Erreur lors du marquage');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Supprimer cette notification ?')) return;
        try {
            await notifications.delete(id);
            setNotificationsList(prev => prev.filter(n => n.id !== id));
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
            leave_approved: 'bg-green-100 text-green-600',
            leave_rejected: 'bg-red-100 text-red-600',
            leave_requested: 'bg-yellow-100 text-yellow-600',
            contract_expiring: 'bg-orange-100 text-orange-600',
            contract_created: 'bg-blue-100 text-blue-600',
            contract_amended: 'bg-purple-100 text-purple-600',
            employee_added: 'bg-indigo-100 text-indigo-600',
            payroll_processed: 'bg-cyan-100 text-cyan-600',
            payroll_paid: 'bg-green-100 text-green-600',
            attendance_clock_in: 'bg-green-100 text-green-600',
            attendance_clock_out: 'bg-red-100 text-red-600',
            training_enrolled: 'bg-blue-100 text-blue-600',
            training_completed: 'bg-green-100 text-green-600',
            recruitment_new: 'bg-pink-100 text-pink-600',
            recruitment_status: 'bg-gray-100 text-gray-600',
            system: 'bg-gray-100 text-gray-600',
        };
        return colors[type] || 'bg-gray-100 text-gray-600';
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            leave_approved: 'Congé approuvé',
            leave_rejected: 'Congé rejeté',
            leave_requested: 'Demande de congé',
            contract_expiring: 'Contrat expirant',
            contract_created: 'Contrat créé',
            contract_amended: 'Contrat modifié',
            employee_added: 'Employé ajouté',
            payroll_processed: 'Paie traitée',
            payroll_paid: 'Paie effectuée',
            attendance_clock_in: 'Pointage entrée',
            attendance_clock_out: 'Pointage sortie',
            training_enrolled: 'Inscription formation',
            training_completed: 'Formation terminée',
            recruitment_new: 'Nouvelle candidature',
            recruitment_status: 'Statut candidature',
            system: 'Système',
        };
        return labels[type] || type;
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

    const unreadCount = notificationsList.filter(n => n.status === 'unread').length;
    const readCount = notificationsList.filter(n => n.status === 'read').length;

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-1">
                        {unreadCount} non lue(s) · {readCount} lue(s)
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Tout marquer lu
                        </button>
                    )}
                    {notificationsList.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Supprimer tout
                        </button>
                    )}
                </div>
            </div>

            <Card>
                <div className="flex items-center space-x-2 mb-4 border-b border-gray-200 pb-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Toutes
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'unread'
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Non lues
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'read'
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Lues
                    </button>
                </div>

                {notificationsList.length === 0 ? (
                    <div className="text-center py-12">
                        <BellIcon className="h-16 w-16 text-gray-300 mx-auto" />
                        <p className="mt-4 text-gray-500 text-lg">Aucune notification</p>
                        <p className="text-sm text-gray-400">Vous êtes à jour !</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notificationsList.map((notification) => {
                            const Icon = getTypeIcon(notification.type);
                            const colorClass = getTypeColor(notification.type);
                            const isUnread = notification.status === 'unread';

                            return (
                                <div
                                    key={notification.id}
                                    className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                                        isUnread
                                            ? 'bg-blue-50/50 border-blue-200'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className={`p-2.5 rounded-xl ${colorClass}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <p className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-xs text-gray-400">
                                                    {getTimeAgo(notification.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    isUnread
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {getTypeLabel(notification.type)}
                                                </span>
                                                {isUnread && (
                                                    <span className="text-xs text-blue-600 font-medium">
                                                        • Non lu
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 ml-4">
                                        {isUnread && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Marquer comme lu"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {pagination.total > pagination.per_page && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Affichage de {((pagination.current_page - 1) * pagination.per_page) + 1} à{' '}
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur{' '}
                            {pagination.total} notifications
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    if (pagination.current_page > 1) {
                                        // fetch avec page - 1
                                    }
                                }}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => {
                                    if (pagination.current_page < pagination.last_page) {
                                        // fetch avec page + 1
                                    }
                                }}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Notifications;