import React, { useState, useEffect } from 'react';
import type { ContractAmendment } from '../../types';
import { contractAmendments } from '../../api/contractAmendments';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { 
    PlusIcon, 
    //PencilIcon, 
    TrashIcon, 
    DocumentIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface ContractAmendmentsProps {
    contractId: number;
    contractData: any;
}

const ContractAmendments: React.FC<ContractAmendmentsProps> = ({ contractId, contractData }) => {
    const [amendments, setAmendments] = useState<ContractAmendment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        type: 'salary_change',
        title: '',
        description: '',
        effective_date: new Date().toISOString().split('T')[0],
        new_base_salary: '',
        new_end_date: '',
        new_type: '',
        new_position_id: '',
    });
    const [positions, setPositions] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        fetchAmendments();
        fetchPositions();
    }, [contractId]);

    const fetchAmendments = async () => {
        try {
            const response = await contractAmendments.index(contractId);
            setAmendments(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des avenants');
        } finally {
            setLoading(false);
        }
    };

    const fetchPositions = async () => {
        try {
            const response = await axios.get('/positions');
            setPositions(response.data.data);
        } catch (error) {
            console.error('Erreur chargement postes', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await contractAmendments.store(contractId, {
                ...formData,
                new_base_salary: parseFloat(formData.new_base_salary) || null,
                new_position_id: parseInt(formData.new_position_id) || null,
            });
            toast.success('Avenant créé avec succès');
            setShowForm(false);
            setFormData({
                type: 'salary_change',
                title: '',
                description: '',
                effective_date: new Date().toISOString().split('T')[0],
                new_base_salary: '',
                new_end_date: '',
                new_type: '',
                new_position_id: '',
            });
            fetchAmendments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet avenant ?')) return;
        try {
            await contractAmendments.delete(id);
            toast.success('Avenant supprimé');
            fetchAmendments();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            salary_change: CurrencyDollarIcon,
            position_change: BriefcaseIcon,
            duration_extension: CalendarIcon,
            working_time_change: ClockIcon,
            contract_type_change: DocumentIcon,
            other: DocumentIcon,
        };
        return icons[type] || DocumentIcon;
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            salary_change: 'bg-green-100 text-green-800 border-green-200',
            position_change: 'bg-blue-100 text-blue-800 border-blue-200',
            duration_extension: 'bg-purple-100 text-purple-800 border-purple-200',
            working_time_change: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            contract_type_change: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            other: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Avenants au contrat</h3>
                    <p className="text-sm text-gray-500">
                        {amendments.length} avenant(s) enregistré(s)
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nouvel avenant
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Créer un avenant</h4>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type d'avenant *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    required
                                >
                                    <option value="salary_change">Changement de salaire</option>
                                    <option value="position_change">Changement de poste</option>
                                    <option value="duration_extension">Prolongation de durée</option>
                                    <option value="working_time_change">Changement de temps de travail</option>
                                    <option value="contract_type_change">Changement de type de contrat</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Titre *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Ex: Augmentation salariale 2024"
                                    required
                                />
                            </div>

                            {/* Date d'effet */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date d'effet *</label>
                                <input
                                    type="date"
                                    value={formData.effective_date}
                                    onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Détails de l'avenant..."
                                />
                            </div>

                            {/* Champs dynamiques selon le type */}
                            {formData.type === 'salary_change' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nouveau salaire *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={formData.new_base_salary}
                                        onChange={(e) => setFormData({ ...formData, new_base_salary: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        placeholder={`Salaire actuel: ${contractData?.base_salary?.toLocaleString() || 0} FCFA`}
                                        required={formData.type === 'salary_change'}
                                    />
                                </div>
                            )}

                            {formData.type === 'duration_extension' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nouvelle date de fin *</label>
                                    <input
                                        type="date"
                                        value={formData.new_end_date}
                                        onChange={(e) => setFormData({ ...formData, new_end_date: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        required={formData.type === 'duration_extension'}
                                    />
                                </div>
                            )}

                            {formData.type === 'position_change' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nouveau poste *</label>
                                    <select
                                        value={formData.new_position_id}
                                        onChange={(e) => setFormData({ ...formData, new_position_id: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        required={formData.type === 'position_change'}
                                    >
                                        <option value="">Sélectionner un poste</option>
                                        {positions.map((pos) => (
                                            <option key={pos.id} value={pos.id}>{pos.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {formData.type === 'contract_type_change' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nouveau type de contrat *</label>
                                    <select
                                        value={formData.new_type}
                                        onChange={(e) => setFormData({ ...formData, new_type: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        required={formData.type === 'contract_type_change'}
                                    >
                                        <option value="">Sélectionner un type</option>
                                        <option value="cdi">CDI</option>
                                        <option value="cdd">CDD</option>
                                        <option value="stage">Stage</option>
                                        <option value="consultant">Consultant</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                {submitting ? 'Création...' : 'Créer l\'avenant'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des avenants */}
            {amendments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-500">Aucun avenant enregistré</p>
                    <p className="text-sm text-gray-400">Créez un premier avenant pour modifier le contrat</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {amendments.map((amendment) => {
                        const Icon = getTypeIcon(amendment.type);
                        const colorClass = getTypeColor(amendment.type);
                        return (
                            <div
                                key={amendment.id}
                                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-2 rounded-lg ${colorClass}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3">
                                                <h4 className="font-semibold text-gray-900">{amendment.title}</h4>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>
                                                    {amendment.type_label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{amendment.description}</p>
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                                                <span>📅 Effet: {new Date(amendment.effective_date).toLocaleDateString('fr-FR')}</span>
                                                {amendment.creator && (
                                                    <span>👤 {amendment.creator?.first_name} {amendment.creator?.last_name}</span>
                                                )}
                                                <span>🕐 {new Date(amendment.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            {/* Détails des changements */}
                                            <div className="mt-3 text-sm">
                                                {amendment.previous_base_salary !== undefined && amendment.new_base_salary && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-500">Salaire:</span>
                                                        <span className="text-gray-400 line-through">
                                                            {amendment.previous_base_salary?.toLocaleString()} FCFA
                                                        </span>
                                                        <span className="text-green-600 font-medium">
                                                            → {amendment.new_base_salary.toLocaleString()} FCFA
                                                        </span>
                                                    </div>
                                                )}
                                                {amendment.previous_end_date && amendment.new_end_date && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-500">Fin:</span>
                                                        <span className="text-gray-400 line-through">
                                                            {new Date(amendment.previous_end_date).toLocaleDateString('fr-FR')}
                                                        </span>
                                                        <span className="text-green-600 font-medium">
                                                            → {new Date(amendment.new_end_date).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                )}
                                                {amendment.previous_position_id && amendment.newPosition && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-500">Poste:</span>
                                                        <span className="text-gray-400 line-through">
                                                            {amendment.previousPosition?.title}
                                                        </span>
                                                        <span className="text-green-600 font-medium">
                                                            → {amendment.newPosition?.title}
                                                        </span>
                                                    </div>
                                                )}
                                                {amendment.previous_type && amendment.new_type && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-500">Type:</span>
                                                        <span className="text-gray-400 line-through">
                                                            {amendment.previous_type.toUpperCase()}
                                                        </span>
                                                        <span className="text-green-600 font-medium">
                                                            → {amendment.new_type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleDelete(amendment.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ContractAmendments;