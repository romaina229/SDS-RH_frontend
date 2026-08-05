import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { employees } from '../../api/employees';
import type { Employee } from '../../types';
import {
    PencilIcon,
    ArrowLeftIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const toast = {
    error: (message: string) => console.error(message),
};

const EmployeeShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async (): Promise<void> => {
        try {
            const response = await employees.show(Number(id));
            setEmployee(response.data.employee);
        } catch (error) {
            toast.error('Erreur lors du chargement de l\'employé');
            navigate('/employees');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (!employee) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Employé non trouvé</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/employees')}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {employee.user?.first_name} {employee.user?.last_name}
                            </h1>
                            <p className="text-gray-500">{employee.employee_number}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/employees/${id}/edit`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        Modifier
                    </button>
                </div>

                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary-600">
                                    {employee.user?.first_name?.[0]}{employee.user?.last_name?.[0]}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Statut</p>
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
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.user?.phone || 'Non renseigné'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.department?.name || 'Aucun département'}</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Embauché le {new Date(employee.hire_date).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Contrats: {employee.contracts?.length || 0}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Salaire: {employee.contracts?.[0]?.base_salary?.toLocaleString() || 'Non défini'} FCFA
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Documents */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
                    <Card>
                        {Array.isArray(employee.documents) && employee.documents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {employee.documents.map((doc) => (
                                    <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <DocumentTextIcon className="h-8 w-8 text-primary-600 mb-2" />
                                        <p className="font-medium text-gray-900">{doc.name}</p>
                                        <p className="text-sm text-gray-500">{doc.type}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Aucun document</p>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeShow;