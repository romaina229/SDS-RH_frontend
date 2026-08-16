import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import CareerTimeline from '../../components/employees/CareerTimeline';
import { employees } from '../../api/employees';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { downloadBlobResponse, extensionFromPath } from '../../utils/downloadFile';
import type { Employee, EmployeeHistory } from '../../types';
import {
    PencilIcon,
    ArrowLeftIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    PlusIcon,
    ClockIcon,
    ArrowDownTrayIcon as DownloadIcon,
} from '@heroicons/react/24/outline';

interface HistoryFormData {
    type: string;
    title: string;
    description: string;
    effective_date: string;
    new_salary: string;
}

const emptyHistoryForm: HistoryFormData = {
    type: 'promotion',
    title: '',
    description: '',
    effective_date: new Date().toISOString().slice(0, 10),
    new_salary: '',
};

const EmployeeShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const queryClient = useQueryClient();
    const employeeId = Number(id);
    const [showHistoryForm, setShowHistoryForm] = useState<boolean>(false);
    const [savingHistory, setSavingHistory] = useState<boolean>(false);
    const [historyForm, setHistoryForm] = useState<HistoryFormData>(emptyHistoryForm);

    const {
        data: employee,
        isPending: loading,
        isError: employeeError,
    } = useQuery<Employee>({
        queryKey: ['employee', employeeId],
        queryFn: async () => (await employees.show(employeeId)).data.employee,
        enabled: Number.isFinite(employeeId),
        staleTime: 60_000,
    });

    const {
        data: history = [],
        isPending: historyLoading,
    } = useQuery<EmployeeHistory[]>({
        queryKey: ['employee-history', employeeId],
        queryFn: async () => (await employees.history.list(employeeId)).data.data,
        enabled: Number.isFinite(employeeId),
        staleTime: 30_000,
    });

    const invalidateHistory = (): Promise<void> =>
        queryClient.invalidateQueries({ queryKey: ['employee-history', employeeId] });

    const historyMutation = useMutation({
        mutationFn: (payload: HistoryFormData) => employees.history.create(employeeId, {
            type: payload.type,
            title: payload.title,
            description: payload.description || null,
            effective_date: payload.effective_date,
            new_salary: payload.new_salary ? Number(payload.new_salary) : null,
        }),
        onSuccess: async () => {
            setHistoryForm(emptyHistoryForm);
            setShowHistoryForm(false);
            await invalidateHistory();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Erreur lors de l'ajout de l'événement");
        },
    });

    const handleAddHistory = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!historyForm.title) return;

        setSavingHistory(true);
        try {
            await historyMutation.mutateAsync(historyForm);
        } catch (error) {
            // Déjà géré par onError de la mutation (toast affiché).
        } finally {
            setSavingHistory(false);
        }
    };

    const handleDownloadDocument = async (docId: number, fileName?: string): Promise<void> => {
        try {
            const response = await axios.get(`/documents/${docId}/download`, {
                responseType: 'blob',
            });
            downloadBlobResponse(response, fileName || 'document');
        } catch (error) {
            toast.error('Erreur lors du téléchargement du document');
        }
    };

    const handleDownloadContract = async (contractId: number, employeeNumber?: string, contractFilePath?: string): Promise<void> => {
        try {
            const response = await axios.get(`/contracts/${contractId}/download`, {
                responseType: 'blob',
            });
            const extension = extensionFromPath(contractFilePath) || '.pdf';
            downloadBlobResponse(response, `contrat-${employeeNumber || id}-${contractId}${extension}`);
        } catch (error) {
            toast.error('Erreur lors du téléchargement du contrat');
        }
    };

    const handleDeleteHistory = async (historyId: number): Promise<void> => {
        if (!confirm('Supprimer cet événement de carrière ?')) return;
        try {
            await employees.history.delete(historyId);
            await invalidateHistory();
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'événement");
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (employeeError || !employee) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Employé non trouvé</p>
            </div>
        );
    }

    return (
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
                                <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-start justify-between">
                                    <div>
                                        <DocumentTextIcon className="h-8 w-8 text-primary-600 mb-2" />
                                        <p className="font-medium text-gray-900">{doc.name}</p>
                                        <p className="text-sm text-gray-500">{doc.type}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadDocument(doc.id, doc.file_name || doc.name)}
                                        className="p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-md"
                                        title="Télécharger"
                                    >
                                        <DownloadIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Aucun document</p>
                    )}
                </Card>
            </div>

            {/* Contrats */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contrats</h2>
                <Card>
                    {Array.isArray(employee.contracts) && employee.contracts.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {employee.contracts.map((contract) => (
                                <div key={contract.id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                                        <div>
                                            <p className="font-medium text-gray-900 uppercase">
                                                {contract.type} · {contract.status}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(contract.start_date).toLocaleDateString('fr-FR')}
                                                {contract.end_date ? ` — ${new Date(contract.end_date).toLocaleDateString('fr-FR')}` : ' — indéterminée'}
                                                {' · '}{Number(contract.base_salary).toLocaleString()} {contract.currency}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {contract.contract_file && (
                                            <button
                                                type="button"
                                                onClick={() => handleDownloadContract(contract.id, employee.employee_number, contract.contract_file)}
                                                className="p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-md"
                                                title="Télécharger le contrat"
                                            >
                                                <DownloadIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/contracts/${contract.id}`)}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-800"
                                        >
                                            Voir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Aucun contrat</p>
                    )}
                </Card>
            </div>

            {/* Historique de carrière */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        Historique de carrière
                    </h2>
                    {hasPermission('edit_employees') && (
                        <button
                            onClick={() => setShowHistoryForm((v) => !v)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Ajouter un événement
                        </button>
                    )}
                </div>

                {showHistoryForm && (
                    <Card className="mb-4">
                        <form onSubmit={handleAddHistory} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type d'événement *</label>
                                    <select
                                        required
                                        value={historyForm.type}
                                        onChange={(e) => setHistoryForm({ ...historyForm, type: e.target.value })}
                                        className="field"
                                    >
                                        <option value="promotion">Promotion</option>
                                        <option value="commendation">Distinction</option>
                                        <option value="warning">Avertissement</option>
                                        <option value="suspension">Suspension</option>
                                        <option value="reinstatement">Réintégration</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date d'effet *</label>
                                    <input
                                        required
                                        type="date"
                                        value={historyForm.effective_date}
                                        onChange={(e) => setHistoryForm({ ...historyForm, effective_date: e.target.value })}
                                        className="field"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Titre *</label>
                                    <input
                                        required
                                        type="text"
                                        value={historyForm.title}
                                        onChange={(e) => setHistoryForm({ ...historyForm, title: e.target.value })}
                                        placeholder="Ex: Promotion au poste de Responsable RH"
                                        className="field"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={historyForm.description}
                                        onChange={(e) => setHistoryForm({ ...historyForm, description: e.target.value })}
                                        rows={2}
                                        className="field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nouveau salaire (optionnel)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={historyForm.new_salary}
                                        onChange={(e) => setHistoryForm({ ...historyForm, new_salary: e.target.value })}
                                        className="field"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowHistoryForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingHistory}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                                >
                                    {savingHistory ? 'Enregistrement...' : "Ajouter à l'historique"}
                                </button>
                            </div>
                        </form>
                    </Card>
                )}

                <Card>
                    {historyLoading ? (
                        <div className="py-8 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600" />
                        </div>
                    ) : (
                        <CareerTimeline
                            history={history}
                            onDelete={hasPermission('edit_employees') ? handleDeleteHistory : undefined}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EmployeeShow;