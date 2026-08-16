import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ContractAmendments from '../../pages/contracts/ContractAmendments';
import type { Contract } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { downloadBlobResponse, extensionFromPath } from '../../utils/downloadFile';
import {
    ArrowLeftIcon,
    PencilIcon,
    DocumentTextIcon,
    //CalendarIcon,
    CurrencyDollarIcon,
    UserIcon,
    BuildingOfficeIcon,
    ClockIcon,
    CheckCircleIcon,
    //ExclamationTriangleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const ContractShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [contract, setContract] = useState<Contract | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'amendments'>('details');

    useEffect(() => {
        fetchContract();
    }, [id]);

    const fetchContract = async (): Promise<void> => {
        try {
            const response = await axios.get(`/contracts/${id}`);
            setContract(response.data.contract);
        } catch (error) {
            toast.error('Erreur lors du chargement du contrat');
            navigate('/contracts');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-800 border-green-200',
            expired: 'bg-red-100 text-red-800 border-red-200',
            terminated: 'bg-gray-100 text-gray-800 border-gray-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, any> = {
            active: CheckCircleIcon,
            expired: XCircleIcon,
            terminated: XCircleIcon,
            pending: ClockIcon,
        };
        return icons[status] || ClockIcon;
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            active: 'Actif',
            expired: 'Expiré',
            terminated: 'Terminé',
            pending: 'En attente',
        };
        return labels[status] || status;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            cdi: 'CDI',
            cdd: 'CDD',
            stage: 'Stage',
            consultant: 'Consultant',
            freelance: 'Freelance',
        };
        return labels[type] || type;
    };

    const handleDownloadContractFile = async (): Promise<void> => {
        if (!contract) return;
        try {
            const response = await axios.get(`/contracts/${contract.id}/download`, {
                responseType: 'blob',
            });
            const extension = extensionFromPath(contract.contract_file) || '.pdf';
            downloadBlobResponse(response, `contrat-${contract.employee?.employee_number || contract.employee_id}-${contract.id}${extension}`);
        } catch (error) {
            toast.error('Erreur lors du téléchargement du contrat');
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (!contract) {
        return (
            <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">Contrat non trouvé</p>
                <button
                    onClick={() => navigate('/contracts')}
                        className="mt-4 text-primary-600 hover:text-primary-700"
                    >
                        Retour à la liste
                    </button>
                </div>
        );
    }

    const StatusIcon = getStatusIcon(contract.status);
    const statusColor = getStatusColor(contract.status);

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/contracts')}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Contrat {contract.employee?.user?.first_name} {contract.employee?.user?.last_name}
                        </h1>
                        <p className="text-gray-500">
                            {getTypeLabel(contract.type)} · {contract.employee?.employee_number}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1.5 inline-flex items-center space-x-2 text-sm font-semibold rounded-full border ${statusColor}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{getStatusLabel(contract.status)}</span>
                    </span>
                    <button
                        onClick={() => navigate(`/contracts/${id}/edit`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        Modifier
                    </button>
                </div>
            </div>

            {/* Onglets */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`py-2 px-1 border-b-2 text-sm font-medium ${
                            activeTab === 'details'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Détails du contrat
                    </button>
                    <button
                        onClick={() => setActiveTab('amendments')}
                        className={`py-2 px-1 border-b-2 text-sm font-medium ${
                            activeTab === 'amendments'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Avenants
                        <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {contract.amendments?.length || 0}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'details' ? (
                <>
                    {/* Informations générales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <UserIcon className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Employé</p>
                                    <p className="font-medium text-gray-900">
                                        {contract.employee?.user?.first_name} {contract.employee?.user?.last_name}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Département</p>
                                    <p className="font-medium text-gray-900">
                                        {contract.employee?.department?.name || 'Non défini'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Salaire</p>
                                    <p className="font-medium text-gray-900">
                                        {contract.base_salary.toLocaleString()} {contract.currency}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Détails du contrat */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Période du contrat">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date de début</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(contract.start_date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date de fin</span>
                                    <span className="font-medium text-gray-900">
                                        {contract.end_date 
                                            ? new Date(contract.end_date).toLocaleDateString('fr-FR')
                                            : 'Indéterminée'
                                        }
                                    </span>
                                </div>
                                {contract.probation_end_date && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Fin de période d'essai</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(contract.probation_end_date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-medium text-gray-900">
                                        {getTypeLabel(contract.type)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Statut</span>
                                    <span className={`px-2 py-1 inline-flex items-center space-x-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                                        <StatusIcon className="h-3 w-3" />
                                        <span>{getStatusLabel(contract.status)}</span>
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card title="Avantages et conditions">
                            <div className="space-y-3">
                                {contract.benefits && Object.keys(contract.benefits).length > 0 ? (
                                    Object.entries(contract.benefits).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-gray-500 capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {typeof value === 'number' 
                                                    ? value.toLocaleString() 
                                                    : String(value)
                                                }
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">Aucun avantage spécifié</p>
                                )}
                                {contract.terms && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">Conditions particulières</p>
                                        <p className="text-sm text-gray-700 mt-1">{contract.terms}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Document du contrat */}
                    {contract.contract_file && (
                        <Card title="Document du contrat">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Contrat signé</p>
                                        <p className="text-sm text-gray-500">
                                            Télécharger le document PDF
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownloadContractFile}
                                    className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"
                                >
                                    Télécharger le document
                                </button>
                            </div>
                        </Card>
                    )}
                </>
            ) : (
                /* Avenants */
                <ContractAmendments 
                    contractId={contract.id} 
                    contractData={contract} 
                />
            )}
        </div>
    );
};

export default ContractShow;