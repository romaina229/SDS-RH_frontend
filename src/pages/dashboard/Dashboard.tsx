import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import StatsCards from '../../components/dashboard/StatsCards';
import DepartmentChart from '../../components/dashboard/DepartmentChart';
import HiringTrend from '../../components/dashboard/HiringTrend';
import RecentActivities from '../../components/dashboard/RecentActivities';
import OrganizationBanner from '../../components/dashboard/OrganizationBanner';
import { dashboard } from '../../api/dashboard';
import type { DashboardStats } from '../../types';

interface DashboardData {
    stats: DashboardStats;
    department_distribution: { name: string; count: number }[];
    hiring_trend: { month: string; count: number }[];
    attendance_today: Record<string, number>;
    recent_activities: any[];
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const { data, isPending, isError, refetch } = useQuery<DashboardData>({
        queryKey: ['dashboard'],
        queryFn: async () => (await dashboard.index()).data,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    if (isError) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Impossible de charger le tableau de bord.</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (isPending || !data) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">

            {/* AJOUT : bandeau avec le nom de l'organisation connectée */}
            <OrganizationBanner />

            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bonjour, {user?.first_name} 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Voici un résumé de votre activité RH
                </p>
                </div>
            <StatsCards stats={data.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepartmentChart data={data.department_distribution} />
                <HiringTrend data={data.hiring_trend} />
            </div>

            <RecentActivities activities={data.recent_activities} />
        </div>
    );
};

export default Dashboard;
