import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { type Contract } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { TrashIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ListParams {
    [key: string]: any;
}

interface ContractData {
    [key: string]: any;
}

export const contracts = {
    list: (params?: ListParams) => axios.get('/contracts', { params }),
    create: (data: ContractData) => axios.post('/contracts', data),
    show: (id: string | number) => axios.get(`/contracts/${id}`),
    update: (id: string | number, data: ContractData) => axios.put(`/contracts/${id}`, data),
    delete: (id: string | number) => axios.delete(`/contracts/${id}`),
    stats: () => axios.get('/contracts/stats'),
};

const Contracts: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [contracts, setContracts] = useState<Contract[]>([]);
    //const [pagination, setPagination] = useState({
    //    current_page: 1,
   //     last_page: 1,
    //    per_page: 15,
    //    total: 0,
   // });
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        search: '',
        page: 1,
    });

    useEffect(() => {
        fetchContracts();
    }, [filters]);

    const fetchContracts = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get('/contracts', { params: filters });
            setContracts(response.data.data);
            //setPagination({
            //    current_page: response.data.current_page,
            //    last_page: response.data.last_page,
            //    per_page: response.data.per_page,
            //    total: response.data.total,
            //});
        } catch (error) {
            toast.error('Erreur lors du chargement des contrats');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) return;
        try {
            await axios.delete(`/contracts/${id}`);
            toast.success('Contrat supprimé avec succès');
            fetchContracts();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-800',
            expired: 'bg-red-100 text-red-800',
            terminated: 'bg-gray-100 text-gray-800',
            pending: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            active: 'Actif',
            expired: 'Expiré',
            terminated: 'Terminé',
            pending: 'En attente',
        };
        return labels[status] || status;
    };

    const getTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            cdi: 'CDI',
            cdd: 'CDD',
            stage: 'Stage',
            consultant: 'Consultant',
            freelance: 'Freelance',
        };
        return labels[type] || type;
    };

    if (loading && contracts.length === 0) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contrats</h1>
                    <p className="text-gray-500 mt-1">Gestion des contrats des employés</p>
                </div>
                {hasPermission('create_contracts') && (
                    <Link
                        to="/contracts/create"
                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nouveau contrat
                    </Link>
                )}
            </div>

            {/* Filtres */}
            <Card>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            name="search"
                            placeholder="Rechercher un contrat..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="active">Actif</option>
                        <option value="expired">Expiré</option>
                        <option value="terminated">Terminé</option>
                        <option value="pending">En attente</option>
                    </select>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option value="">Tous les types</option>
                        <option value="cdi">CDI</option>
                        <option value="cdd">CDD</option>
                        <option value="stage">Stage</option>
                        <option value="consultant">Consultant</option>
                        <option value="freelance">Freelance</option>
                    </select>
                </div>
            </Card>

            {/* Tableau */}
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
                                    Salaire
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
                            {contracts.map((contract) => (
                                <tr key={contract.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {contract.employee?.user?.first_name} {contract.employee?.user?.last_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {contract.employee?.employee_number}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {getTypeLabel(contract.type)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>{new Date(contract.start_date).toLocaleDateString('fr-FR')}</div>
                                        {contract.end_date && (
                                            <div className="text-xs text-gray-500">
                                                → {new Date(contract.end_date).toLocaleDateString('fr-FR')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {contract.base_salary.toLocaleString()} {contract.currency}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                                            {getStatusLabel(contract.status)}
                                        </span>
                                        {contract.is_expiring_soon && (
                                            <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800">
                                                Expire bientôt
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            {hasPermission('edit_contracts') && (
                                                <Link
                                                    to={`/contracts/${contract.id}/edit`}
                                                    className="text-primary-600 hover:text-primary-900"
                                                    title="Modifier le contrat"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </Link>
                                            )}
                                            {hasPermission('delete_contracts') && (
                                                <button
                                                    onClick={() => handleDelete(contract.id)}
                                                    className="text-danger-600 hover:text-danger-900"
                                                    title="Terminer le contrat"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Contracts;