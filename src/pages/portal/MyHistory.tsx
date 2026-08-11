import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import CareerTimeline from '../../components/employees/CareerTimeline';
import { portal } from '../../api/portal';
import type { EmployeeHistory } from '../../types';
import toast from 'react-hot-toast';
import { ClockIcon } from '@heroicons/react/24/outline';

const MyHistory: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [history, setHistory] = useState<EmployeeHistory[]>([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async (): Promise<void> => {
        try {
            const response = await portal.history();
            setHistory(response.data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du chargement de votre parcours');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ClockIcon className="h-6 w-6 text-gray-400" />
                    Mon parcours
                </h1>
                <p className="text-gray-500 mt-1">
                    La chronologie de votre carrière au sein de l'organisation : embauche, mutations,
                    promotions, changements de salaire et de contrat.
                </p>
            </div>

            <Card>
                <CareerTimeline history={history} />
            </Card>
        </div>
    );
};

export default MyHistory;
