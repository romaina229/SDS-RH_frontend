import React from 'react';
import Card from '../common/Card';
import {
    UserPlusIcon,
    CalendarIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Activity {
    type: string;
    message: string;
    status: string;
    date: string;
}

interface RecentActivitiesProps {
    activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
    const getActivityIcon = (type: string, status: string) => {
        const icons: Record<string, React.ReactNode> = {
            leave: status === 'pending' ? (
                <ClockIcon className="h-5 w-5 text-yellow-500" />
            ) : status === 'approved' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
            ),
            hire: <UserPlusIcon className="h-5 w-5 text-blue-500" />,
            contract: <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />,
            document: <DocumentTextIcon className="h-5 w-5 text-purple-500" />,
            default: <CalendarIcon className="h-5 w-5 text-gray-400" />,
        };
        return icons[type] || icons.default;
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
            warning: 'bg-orange-100 text-orange-800',
            default: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || colors.default;
    };

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            pending: 'En attente',
            approved: 'Approuvé',
            rejected: 'Rejeté',
            completed: 'Terminé',
            warning: 'Attention',
        };
        return labels[status] || status;
    };

    if (!activities || activities.length === 0) {
        return (
            <Card title="Activités récentes">
                <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="mt-2 text-gray-500">Aucune activité récente</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Activités récentes">
            <div className="flow-root">
                <ul className="-my-4 divide-y divide-gray-200">
                    {activities.map((activity, index) => (
                        <li key={index} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        {getActivityIcon(activity.type, activity.status)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {activity.message}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                                            {getStatusLabel(activity.status)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {activity.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};

export default RecentActivities;