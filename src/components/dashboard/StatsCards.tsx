import React from 'react';
import Card from '../common/Card';
import type { DashboardStats } from '../../types';
import {
    UsersIcon,
    UserGroupIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ClockIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface StatsCardsProps {
    stats: DashboardStats;
}

interface CardItem {
    title: string;
    value: string | number;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    color: string;
    format?: 'currency';
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    const cards: CardItem[] = [
        {
            title: 'Employés',
            value: stats?.total_employees || 0,
            icon: UsersIcon,
            color: 'bg-primary-500',
        },
        {
            title: 'Départements',
            value: stats?.total_departments || 0,
            icon: UserGroupIcon,
            color: 'bg-secondary-500',
        },
        {
            title: 'Contrats actifs',
            value: stats?.active_contracts || 0,
            icon: DocumentTextIcon,
            color: 'bg-blue-500',
        },
        {
            title: 'Présents aujourd\'hui',
            value: stats?.present_today || 0,
            icon: ClockIcon,
            color: 'bg-green-500',
        },
        {
            title: 'Congés en attente',
            value: stats?.pending_leaves || 0,
            icon: CalendarIcon,
            color: 'bg-warning-500',
        },
        {
            title: 'Masse salariale',
            value: stats?.payroll_total || '0 FCFA',
            icon: CurrencyDollarIcon,
            color: 'bg-purple-500',
            format: 'currency',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {card.format === 'currency' 
                                    ? card.value 
                                    : typeof card.value === 'number' 
                                        ? card.value.toLocaleString() 
                                        : card.value}
                            </p>
                        </div>
                        <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                            <card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default StatsCards;