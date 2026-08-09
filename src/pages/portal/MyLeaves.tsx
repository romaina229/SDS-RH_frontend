import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { portal } from '../../api/portal';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

interface PortalLeave {
    id: number;
    type: string;
    start_date: string;
    end_date: string;
    days: number;
    status: string;
    reason?: string;
    rejection_reason?: string;
}

interface LeaveBalance {
    annual_entitled: number;
    annual_taken: number;
    annual_remaining: number;
    sick_entitled: number;
    sick_taken: number;
    sick_remaining: number;
}

const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        pending: 'En attente',
        approved: 'Approuvé',
        rejected: 'Rejeté',
        cancelled: 'Annulé',
    };
    return labels[status] || status;
};

const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        annual: 'Annuel',
        sick: 'Maladie',
        maternity: 'Maternité',
        paternity: 'Paternité',
        exceptional: 'Exceptionnel',
        unpaid: 'Sans solde',
        training: 'Formation',
    };
    return labels[type] || type;
};

const MyLeaves: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [leaves, setLeaves] = useState<PortalLeave[]>([]);
    const [balance, setBalance] = useState<LeaveBalance | null>(null);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async (): Promise<void> => {
        try {
            const [leavesRes, balanceRes] = await Promise.all([
                portal.leaves({ per_page: 50 }),
                portal.leaveBalance(),
            ]);
            setLeaves(leavesRes.data.data);
            setBalance(balanceRes.data.balance);
        } catch (error) {
            toast.error('Erreur lors du chargement de vos congés');
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Mes congés</h1>
                        <p className="text-gray-500 mt-1">Historique et suivi de vos demandes de congé</p>
                    </div>
                    <button
                        onClick={() => navigate('/leaves/create')}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nouvelle demande
                    </button>
                </div>

                {balance && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <p className="text-sm text-gray-500">Congés annuels</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {balance.annual_remaining}{' '}
                                <span className="text-sm font-normal text-gray-400">
                                    / {balance.annual_entitled} jours
                                </span>
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-secondary-500 h-2 rounded-full"
                                    style={{
                                        width: `${
                                            balance.annual_entitled
                                                ? Math.min(100, (balance.annual_taken / balance.annual_entitled) * 100)
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                        </Card>
                        <Card>
                            <p className="text-sm text-gray-500">Congés maladie</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {balance.sick_remaining}{' '}
                                <span className="text-sm font-normal text-gray-400">
                                    / {balance.sick_entitled} jours
                                </span>
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                        width: `${
                                            balance.sick_entitled
                                                ? Math.min(100, (balance.sick_taken / balance.sick_entitled) * 100)
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                        </Card>
                    </div>
                )}

                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Période
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jours
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Motif du rejet
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaves.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                            Vous n'avez encore soumis aucune demande de congé.
                                        </td>
                                    </tr>
                                )}
                                {leaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getTypeLabel(leave.type)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>{new Date(leave.start_date).toLocaleDateString('fr-FR')}</div>
                                            <div className="text-xs text-gray-500">
                                                → {new Date(leave.end_date).toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                    leave.status
                                                )}`}
                                            >
                                                {getStatusLabel(leave.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{leave.rejection_reason || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default MyLeaves;
