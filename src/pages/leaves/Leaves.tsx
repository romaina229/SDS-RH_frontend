import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Leave } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { PlusIcon, CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

const Leaves: React.FC = () => {
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    //const [pagination, setPagination] = useState({
    //    current_page: 1,
    //    last_page: 1,
    //    per_page: 15,
    //    total: 0,
    //});
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        employee_id: '',
        page: 1,
    });

    useEffect(() => {
        fetchLeaves();
    }, [filters]);

    const fetchLeaves = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get('/leaves', { params: filters });
            setLeaves(response.data.data);
            //setPagination({
            //    current_page: response.data.current_page,
            //    last_page: response.data.last_page,
            //    per_page: response.data.per_page,
            //    total: response.data.total,
            //});
        } catch (error) {
            toast.error('Erreur lors du chargement des congés');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number): Promise<void> => {
        try {
            await axios.post(`/leaves/${id}/approve`);
            toast.success('Congé approuvé avec succès');
            fetchLeaves();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'approbation');
        }
    };

    const handleReject = async (id: number): Promise<void> => {
        const reason = prompt('Motif du rejet :');
        if (reason === null) return;
        try {
            await axios.post(`/leaves/${id}/reject`, { rejection_reason: reason });
            toast.success('Congé rejeté');
            fetchLeaves();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du rejet');
        }
    };

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

    if (loading && leaves.length === 0) {
        return <Loading fullScreen />;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Congés</h1>
                        <p className="text-gray-500 mt-1">Gestion des demandes de congé</p>
                    </div>
                    <button
                        onClick={() => navigate('/leaves/create')}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Demander un congé
                    </button>
                </div>

                {/* Filtres */}
                <Card>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            name="status"
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="approved">Approuvé</option>
                            <option value="rejected">Rejeté</option>
                            <option value="cancelled">Annulé</option>
                        </select>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={(e) => setFilters({...filters, type: e.target.value, page: 1})}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                            <option value="">Tous les types</option>
                            <option value="annual">Annuel</option>
                            <option value="sick">Maladie</option>
                            <option value="maternity">Maternité</option>
                            <option value="paternity">Paternité</option>
                            <option value="exceptional">Exceptionnel</option>
                            <option value="unpaid">Sans solde</option>
                            <option value="training">Formation</option>
                        </select>
                    </div>
                </Card>

                {/* Liste des congés */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employé
                                    </th>
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
                                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {leave.employee?.user?.first_name} {leave.employee?.user?.last_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getTypeLabel(leave.type)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>{new Date(leave.start_date).toLocaleDateString('fr-FR')}</div>
                                            <div className="text-xs text-gray-500">
                                                → {new Date(leave.end_date).toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {leave.days}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                                                {getStatusLabel(leave.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            {leave.status === 'pending' && hasPermission('approve_leaves') && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(leave.id)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                    >
                                                        <CheckIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(leave.id)}
                                                        className="text-danger-600 hover:text-danger-900"
                                                    >
                                                        <XMarkIcon className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
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

export default Leaves;