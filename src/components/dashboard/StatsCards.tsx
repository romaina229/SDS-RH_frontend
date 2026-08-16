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
    UserMinusIcon,
    UserPlusIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface StatsCardsProps {
    stats: DashboardStats;
}

interface CardItem {
    title: string;
    value: string | number;
    icon: React.ForwardRefExoticComponent<
        React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
    >;
    gradient: string;
    iconBg: string;
    iconColor: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    const cards: CardItem[] = [
        {
            title: 'Employés',
            value: stats?.total_employees || 0,
            icon: UsersIcon,
            gradient: 'from-indigo-600 via-blue-600 to-blue-500',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
        },
        {
            title: 'Départements',
            value: stats?.total_departments || 0,
            icon: UserGroupIcon,
            gradient: 'from-emerald-600 via-green-500 to-teal-400',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            title: 'Contrats actifs',
            value: stats?.active_contracts || 0,
            icon: DocumentTextIcon,
            gradient: 'from-blue-700 via-cyan-600 to-sky-500',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: "Présents aujourd'hui",
            value: stats?.present_today || 0,
            icon: ClockIcon,
            gradient: 'from-green-600 via-emerald-500 to-teal-400',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: "Absents aujourd'hui",
            value: stats?.absent_today || 0,
            icon: UserMinusIcon,
            gradient: 'from-red-600 via-rose-500 to-pink-500',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            title: 'Congés en attente',
            value: stats?.pending_leaves || 0,
            icon: CalendarIcon,
            gradient: 'from-amber-500 via-orange-500 to-yellow-400',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
        },
        {
            title: 'Nouvelles embauches (30j)',
            value: stats?.new_hires || 0,
            icon: UserPlusIcon,
            gradient: 'from-teal-600 via-cyan-500 to-emerald-400',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600',
        },
        {
            title: 'Contrats à échéance (30j)',
            value: stats?.contracts_expiring || 0,
            icon: ExclamationTriangleIcon,
            gradient: 'from-orange-600 via-red-500 to-amber-400',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
        {
            title: 'Masse salariale',
            value: stats?.payroll_total
                ? `${stats.payroll_total.toLocaleString()} FCFA`
                : '0 FCFA',
            icon: CurrencyDollarIcon,
            gradient: 'from-purple-700 via-violet-600 to-fuchsia-500',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    return (
        <>
            {/* Animations des arrière-plans */}
            <style>{`
                @keyframes statsFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }

                    50% {
                        transform: translate(7px, -7px) scale(1.06);
                    }
                }

                @keyframes statsFloatReverse {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }

                    50% {
                        transform: translate(-8px, 6px) scale(1.08);
                    }
                }

                @keyframes statsShine {
                    0% {
                        transform: translateX(-120%) rotate(12deg);
                    }

                    100% {
                        transform: translateX(350%) rotate(12deg);
                    }
                }

                .stats-decoration-one {
                    animation: statsFloat 6s ease-in-out infinite;
                }

                .stats-decoration-two {
                    animation: statsFloatReverse 7s ease-in-out infinite;
                }

                .stats-shine {
                    animation: statsShine 8s ease-in-out infinite;
                }
            `}</style>

            {/* Grille des statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {cards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={index}
                            className={`
                                group
                                relative
                                overflow-hidden
                                rounded-xl
                                bg-gradient-to-br
                                ${card.gradient}
                                p-[1px]
                                shadow-sm
                                transition-all
                                duration-500
                                hover:-translate-y-1
                                hover:shadow-xl
                            `}
                        >
                            {/* Cercle lumineux supérieur droit */}
                            <div
                                className="
                                    stats-decoration-one
                                    pointer-events-none
                                    absolute
                                    -right-10
                                    -top-10
                                    h-28
                                    w-28
                                    rounded-full
                                    bg-white/20
                                    blur-2xl
                                "
                            />

                            {/* Cercle lumineux inférieur gauche */}
                            <div
                                className="
                                    stats-decoration-two
                                    pointer-events-none
                                    absolute
                                    -bottom-10
                                    -left-8
                                    h-24
                                    w-24
                                    rounded-full
                                    bg-white/15
                                    blur-2xl
                                "
                            />

                            {/* Effet lumineux qui traverse la carte */}
                            <div
                                className="
                                    stats-shine
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    -left-1/2
                                    w-1/3
                                    bg-white/10
                                    blur-xl
                                "
                            />

                            <Card
                                className="
                                    relative
                                    !border-0
                                    !bg-transparent
                                    !shadow-none
                                    overflow-hidden
                                    rounded-xl
                                    p-0
                                "
                            >
                                {/* Zone colorée principale */}
                                <div className="relative px-4 pt-4 pb-5 text-white">

                                    <div className="flex items-start justify-between">

                                        {/* Informations */}
                                        <div className="min-w-0">

                                            <p className="truncate text-xs font-medium text-white/80">
                                                {card.title}
                                            </p>

                                            <p className="mt-1 text-2xl font-bold tracking-tight">
                                                {typeof card.value === 'number'
                                                    ? card.value.toLocaleString()
                                                    : card.value}
                                            </p>

                                        </div>

                                        {/* Icône principale */}
                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-white/20
                                                bg-white/20
                                                backdrop-blur-md
                                                transition-all
                                                duration-300
                                                group-hover:scale-110
                                                group-hover:rotate-3
                                            "
                                        >
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                    </div>

                                </div>

                                {/* Bloc blanc intérieur */}
                                <div
                                    className="
                                        relative
                                        mx-2.5
                                        mb-2.5
                                        rounded-lg
                                        bg-white
                                        px-3
                                        py-2
                                        shadow-md
                                        transition-all
                                        duration-300
                                        group-hover:shadow-lg
                                    "
                                >
                                    <div className="flex items-center justify-between">

                                        {/* Texte */}
                                        <div className="min-w-0">

                                            <p className="text-[10px] font-medium text-gray-400">
                                                Statistique
                                            </p>

                                            <p className="mt-0.5 truncate text-xs font-semibold text-gray-700">
                                                {card.title}
                                            </p>

                                        </div>

                                        {/* Petite icône */}
                                        <div
                                            className={`
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                ${card.iconBg}
                                            `}
                                        >
                                            <Icon
                                                className={`
                                                    h-4
                                                    w-4
                                                    ${card.iconColor}
                                                `}
                                            />
                                        </div>

                                    </div>
                                </div>

                            </Card>
                        </div>
                    );
                })}

            </div>
        </>
    );
};

export default StatsCards;