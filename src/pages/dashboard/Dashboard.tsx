import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import StatsCards from '../../components/dashboard/StatsCards';
import DepartmentChart from '../../components/dashboard/DepartmentChart';
import HiringTrend from '../../components/dashboard/HiringTrend';
import RecentActivities from '../../components/dashboard/RecentActivities';
import { dashboard } from '../../api/dashboard';
import type { DashboardStats } from '../../types';
import toast from 'react-hot-toast';

interface DashboardData {
    stats: DashboardStats;
    department_distribution: { name: string; count: number }[];
    hiring_trend: { month: string; count: number }[];
    attendance_today: Record<string, number>;
    recent_activities: any[];
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<DashboardData>({
        stats: {} as DashboardStats,
        department_distribution: [],
        hiring_trend: [],
        attendance_today: {},
        recent_activities: [],
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (): Promise<void> => {
        try {
            const response = await dashboard.index();
            setData(response.data);
        } catch (error) {
            toast.error('Erreur lors du chargement du tableau de bord');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <Layout>
            <div className="space-y-6">
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
        </Layout>
    );
};

export default Dashboard;