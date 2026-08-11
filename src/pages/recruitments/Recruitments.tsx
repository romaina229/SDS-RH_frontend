import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Recruitment, Candidate } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    BriefcaseIcon,
    CalendarIcon,
    UserGroupIcon,
    CheckIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';

const Recruitments: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showCandidates, setShowCandidates] = useState<number | null>(null);
    const [editing, setEditing] = useState<Recruitment | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        position_id: '',
        number_of_positions: '1',
        closing_date: '',
        status: 'draft',
    });
    const [candidateForm, setCandidateForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        cover_letter: '',
        expected_salary: '',
        available_from: '',
    });
    const [showCandidateForm, setShowCandidateForm] = useState<number | null>(null);

    useEffect(() => {
        fetchRecruitments();
    }, []);

    const fetchRecruitments = async (): Promise<void> => {
        try {
            const response = await axios.get('/recruitments');
            setRecruitments(response.data.data || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des recrutements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                number_of_positions: parseInt(formData.number_of_positions) || 1,
                posted_date: new Date().toISOString().split('T')[0],
            };

            if (editing) {
                await axios.put(`/recruitments/${editing.id}`, data);
                toast.success('Recrutement mis à jour avec succès');
            } else {
                await axios.post('/recruitments', data);
                toast.success('Recrutement créé avec succès');
            }
            resetForm();
            fetchRecruitments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce recrutement ?')) return;
        try {
            await axios.delete(`/recruitments/${id}`);
            toast.success('Recrutement supprimé avec succès');
            fetchRecruitments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handlePublish = async (id: number): Promise<void> => {
        try {
            await axios.post(`/recruitments/${id}/publish`);
            toast.success('Recrutement publié avec succès');
            fetchRecruitments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la publication');
        }
    };

    const handleAddCandidate = async (recruitmentId: number): Promise<void> => {
        try {
            await axios.post(`/recruitments/${recruitmentId}/candidates`, {
                ...candidateForm,
                expected_salary: parseFloat(candidateForm.expected_salary) || null,
            });
            toast.success('Candidat ajouté avec succès');
            setShowCandidateForm(null);
            setCandidateForm({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                cover_letter: '',
                expected_salary: '',
                available_from: '',
            });
            fetchRecruitments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du candidat');
        }
    };

    const updateCandidateStatus = async (recruitmentId: number, candidateId: number, status: string): Promise<void> => {
        try {
            await axios.put(`/recruitments/${recruitmentId}/candidates/${candidateId}`, { status });
            toast.success('Statut du candidat mis à jour');
            fetchRecruitments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    };

    const resetForm = (): void => {
        setFormData({
            title: '',
            description: '',
            requirements: '',
            position_id: '',
            number_of_positions: '1',
            closing_date: '',
            status: 'draft',
        });
        setEditing(null);
        setShowForm(false);
    };

    const editRecruitment = (recruitment: Recruitment): void => {
        setEditing(recruitment);
        setFormData({
            title: recruitment.title,
            description: recruitment.description || '',
            requirements: recruitment.requirements || '',
            position_id: String(recruitment.position_id || ''),
            number_of_positions: String(recruitment.number_of_positions || 1),
            closing_date: recruitment.closing_date,
            status: recruitment.status,
        });
        setShowForm(true);
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800',
            published: 'bg-green-100 text-green-800',
            closed: 'bg-red-100 text-red-800',
            cancelled: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            draft: 'Brouillon',
            published: 'Publié',
            closed: 'Fermé',
            cancelled: 'Annulé',
        };
        return labels[status] || status;
    };

    const getCandidateStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            new: 'bg-blue-100 text-blue-800',
            screened: 'bg-yellow-100 text-yellow-800',
            interviewed: 'bg-purple-100 text-purple-800',
            offered: 'bg-green-100 text-green-800',
            hired: 'bg-emerald-100 text-emerald-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getCandidateStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            new: 'Nouveau',
            screened: 'Présélectionné',
            interviewed: 'Entretien',
            offered: 'Offre',
            hired: 'Embauché',
            rejected: 'Refusé',
        };
        return labels[status] || status;
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recrutement</h1>
                    <p className="text-gray-500 mt-1">Gestion des processus de recrutement</p>
                </div>
                {hasPermission('create_recruitments') && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nouveau recrutement
                    </button>
                )}
            </div>

            {showForm && (
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {editing ? 'Modifier le recrutement' : 'Nouveau recrutement'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Titre du poste *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Décrivez le poste, les responsabilités, etc."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Exigences</label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Compétences requises, expérience, diplômes, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre de postes *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.number_of_positions}
                                    onChange={(e) => setFormData({...formData, number_of_positions: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date de clôture *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.closing_date}
                                    onChange={(e) => setFormData({...formData, closing_date: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Statut</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="draft">Brouillon</option>
                                    <option value="published">Publié</option>
                                    <option value="closed">Fermé</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                            >
                                {editing ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {recruitments.map((recruitment) => (
                    <Card key={recruitment.id} className="hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-primary-50 rounded-lg">
                                        <BriefcaseIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{recruitment.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {recruitment.number_of_positions} poste(s) disponible(s)
                                        </p>
                                    </div>
                                </div>

                                {recruitment.description && (
                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{recruitment.description}</p>
                                )}

                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>Clôture: {new Date(recruitment.closing_date).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <UserGroupIcon className="h-4 w-4" />
                                        <span>{recruitment.candidates?.length || 0} candidat(s)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(recruitment.status)}`}>
                                    {getStatusLabel(recruitment.status)}
                                </span>

                                {recruitment.status === 'draft' && (
                                    <button
                                        onClick={() => handlePublish(recruitment.id)}
                                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                                    >
                                        <CheckIcon className="h-4 w-4 mr-1" />
                                        Publier
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowCandidates(showCandidates === recruitment.id ? null : recruitment.id)}
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                >
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    Candidats
                                </button>

                                <button
                                    onClick={() => setShowCandidateForm(showCandidateForm === recruitment.id ? null : recruitment.id)}
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                                >
                                    <UserPlusIcon className="h-4 w-4 mr-1" />
                                    Ajouter
                                </button>

                                {hasPermission('edit_recruitments') && (
                                    <button
                                        onClick={() => editRecruitment(recruitment)}
                                        className="p-1 text-blue-600 hover:text-blue-900"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                )}
                                {hasPermission('delete_recruitments') && (
                                    <button
                                        onClick={() => handleDelete(recruitment.id)}
                                        className="p-1 text-danger-600 hover:text-danger-900"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Formulaire d'ajout de candidat */}
                        {showCandidateForm === recruitment.id && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3">Ajouter un candidat</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                                        <input
                                            type="text"
                                            required
                                            value={candidateForm.first_name}
                                            onChange={(e) => setCandidateForm({...candidateForm, first_name: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                        <input
                                            type="text"
                                            required
                                            value={candidateForm.last_name}
                                            onChange={(e) => setCandidateForm({...candidateForm, last_name: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={candidateForm.email}
                                            onChange={(e) => setCandidateForm({...candidateForm, email: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={candidateForm.phone}
                                            onChange={(e) => setCandidateForm({...candidateForm, phone: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Lettre de motivation</label>
                                        <textarea
                                            value={candidateForm.cover_letter}
                                            onChange={(e) => setCandidateForm({...candidateForm, cover_letter: e.target.value})}
                                            rows={2}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Salaire attendu (FCFA)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={candidateForm.expected_salary}
                                            onChange={(e) => setCandidateForm({...candidateForm, expected_salary: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Disponible à partir du</label>
                                        <input
                                            type="date"
                                            value={candidateForm.available_from}
                                            onChange={(e) => setCandidateForm({...candidateForm, available_from: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCandidateForm(null)}
                                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => handleAddCandidate(recruitment.id)}
                                        className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                                    >
                                        Ajouter le candidat
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Liste des candidats */}
                        {showCandidates === recruitment.id && (
                            <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-3">Candidats</h4>
                                {recruitment.candidates && recruitment.candidates.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                                    <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                    <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                                    <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recruitment.candidates.map((candidate: Candidate) => (
                                                    <tr key={candidate.id} className="hover:bg-gray-50">
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                            {candidate.first_name} {candidate.last_name}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                            {candidate.email}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCandidateStatusColor(candidate.status)}`}>
                                                                {getCandidateStatusLabel(candidate.status)}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                            <div className="flex space-x-1">
                                                                <select
                                                                    onChange={(e) => updateCandidateStatus(recruitment.id, candidate.id, e.target.value)}
                                                                    value={candidate.status}
                                                                    className="text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                >
                                                                    <option value="new">Nouveau</option>
                                                                    <option value="screened">Présélectionné</option>
                                                                    <option value="interviewed">Entretien</option>
                                                                    <option value="offered">Offre</option>
                                                                    <option value="hired">Embauché</option>
                                                                    <option value="rejected">Refusé</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Aucun candidat pour ce recrutement</p>
                                )}
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {recruitments.length === 0 && (
                <div className="text-center py-12">
                    <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-500">Aucun recrutement en cours</p>
                    {hasPermission('create_recruitments') && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-primary-600 hover:text-primary-700"
                        >
                            + Lancer un recrutement
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Recruitments;