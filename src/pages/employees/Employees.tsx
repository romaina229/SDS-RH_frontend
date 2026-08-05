import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { employees } from '../../api/employees';
import { useAuth } from '../../context/AuthContext';
import type { Employee, PaginatedResponse } from '../../types';
import toast from 'react-hot-toast';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    EyeIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

interface Filters {
    search: string;
    department_id: string;
    status: string;
    page: number;
}

const Employees: React.FC = () => {
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [employeesData, setEmployeesData] = useState<Employee[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });
    const [filters, setFilters] = useState<Filters>({
        search: '',
        department_id: '',
        status: '',
        page: 1,
    });

    useEffect(() => {
        fetchEmployees();
    }, [filters]);

    const fetchEmployees = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await employees.list(filters);
            const data = response.data as PaginatedResponse<Employee>;
            setEmployeesData(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                per_page: data.per_page,
                total: data.total,
            });
        } catch (error) {
            toast.error('Erreur lors du chargement des employés');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;

        try {
            await employees.delete(id);
            toast.success('Employé supprimé avec succès');
            fetchEmployees();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
            page: 1,
        });
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            fetchEmployees();
        }
    };

    const handlePageChange = (page: number): void => {
        setFilters({ ...filters, page });
    };

    if (loading && employeesData.length === 0) {
        return <Loading fullScreen />;
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Employés</h1>
                        <p className="text-gray-500 mt-1">
                            Gestion du personnel de l'organisation
                        </p>
                    </div>
                    {hasPermission('create_employees') && (
                        <button
                            onClick={() => navigate('/employees/create')}
                            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Nouvel employé
                        </button>
                    )}
                </div>

                {/* Filtres */}
                <Card>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Rechercher un employé..."
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    onKeyDown={handleSearch}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                name="department_id"
                                value={filters.department_id}
                                onChange={handleFilterChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                                <option value="">Tous les départements</option>
                            </select>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="on_leave">En congé</option>
                                <option value="terminated">Terminé</option>
                                <option value="suspended">Suspendu</option>
                            </select>
                        </div>
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
                                        Matricule
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Département
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
                                {employeesData.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <span className="text-primary-600 font-semibold">
                                                        {employee.user?.first_name?.[0]}{employee.user?.last_name?.[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {employee.user?.first_name} {employee.user?.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {employee.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {employee.employee_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {employee.department?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                employee.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : employee.status === 'on_leave'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : employee.status === 'terminated'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {employee.status === 'active' ? 'Actif' :
                                                 employee.status === 'on_leave' ? 'En congé' :
                                                 employee.status === 'terminated' ? 'Terminé' : 'Suspendu'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/employees/${employee.id}`)}
                                                className="text-primary-600 hover:text-primary-900 mr-3"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            {hasPermission('edit_employees') && (
                                                <button
                                                    onClick={() => navigate(`/employees/${employee.id}/edit`)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {hasPermission('delete_employees') && (
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="text-danger-600 hover:text-danger-900"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.total > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Précédent
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Suivant
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Affichage de <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> à{' '}
                                        <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> sur{' '}
                                        <span className="font-medium">{pagination.total}</span> résultats
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {[...Array(Math.min(pagination.last_page, 10))].map((_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        pagination.current_page === pageNum
                                                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default Employees;