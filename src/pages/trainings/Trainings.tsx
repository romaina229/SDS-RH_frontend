import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Training } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    AcademicCapIcon,
    CalendarIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';

const Trainings: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editing, setEditing] = useState<Training | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'internal',
        start_date: '',
        end_date: '',
        location: '',
        trainer: '',
        cost: '',
        max_participants: '',
        status: 'planned',
    });

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async (): Promise<void> => {
        try {
            const response = await axios.get('/trainings');
            setTrainings(response.data.data || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des formations');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                cost: parseFloat(formData.cost) || 0,
                max_participants: parseInt(formData.max_participants) || null,
            };

            if (editing) {
                await axios.put(`/trainings/${editing.id}`, data);
                toast.success('Formation mise à jour avec succès');
            } else {
                await axios.post('/trainings', data);
                toast.success('Formation créée avec succès');
            }
            resetForm();
            fetchTrainings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;
        try {
            await axios.delete(`/trainings/${id}`);
            toast.success('Formation supprimée avec succès');
            fetchTrainings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleEnroll = async (id: number): Promise<void> => {
        try {
            await axios.post(`/trainings/${id}/enroll`);
            toast.success('Inscription réussie');
            fetchTrainings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    };

    const handleComplete = async (id: number): Promise<void> => {
        try {
            await axios.post(`/trainings/${id}/complete`);
            toast.success('Formation terminée avec succès');
            fetchTrainings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la validation');
        }
    };

    const resetForm = (): void => {
        setFormData({
            title: '',
            description: '',
            type: 'internal',
            start_date: '',
            end_date: '',
            location: '',
            trainer: '',
            cost: '',
            max_participants: '',
            status: 'planned',
        });
        setEditing(null);
        setShowForm(false);
    };

    const editTraining = (training: Training): void => {
        setEditing(training);
        setFormData({
            title: training.title,
            description: training.description || '',
            type: training.type,
            start_date: training.start_date,
            end_date: training.end_date,
            location: training.location || '',
            trainer: training.trainer || '',
            cost: String(training.cost || ''),
            max_participants: String(training.max_participants || ''),
            status: training.status,
        });
        setShowForm(true);
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            planned: 'bg-blue-100 text-blue-800',
            ongoing: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            planned: 'Planifiée',
            ongoing: 'En cours',
            completed: 'Terminée',
            cancelled: 'Annulée',
        };
        return labels[status] || status;
    };

    const getTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            internal: 'Interne',
            external: 'Externe',
            online: 'En ligne',
            workshop: 'Atelier',
        };
        return labels[type] || type;
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Formations</h1>
                        <p className="text-gray-500 mt-1">Gestion des formations et développement des compétences</p>
                    </div>
                    {hasPermission('create_trainings') && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Nouvelle formation
                        </button>
                    )}
                </div>

                {showForm && (
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editing ? 'Modifier la formation' : 'Nouvelle formation'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Titre *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    >
                                        <option value="internal">Interne</option>
                                        <option value="external">Externe</option>
                                        <option value="online">En ligne</option>
                                        <option value="workshop">Atelier</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    >
                                        <option value="planned">Planifiée</option>
                                        <option value="ongoing">En cours</option>
                                        <option value="completed">Terminée</option>
                                        <option value="cancelled">Annulée</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de début *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de fin *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lieu</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Formateur</label>
                                    <input
                                        type="text"
                                        value={formData.trainer}
                                        onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Coût (FCFA)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre max de participants</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.max_participants}
                                        onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trainings.map((training) => (
                        <Card key={training.id} className="hover:shadow-md transition-shadow">
                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-primary-50 rounded-lg">
                                            <AcademicCapIcon className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{training.title}</h3>
                                            <p className="text-sm text-gray-500">{getTypeLabel(training.type)}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(training.status)}`}>
                                        {getStatusLabel(training.status)}
                                    </span>
                                </div>

                                {training.description && (
                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{training.description}</p>
                                )}

                                <div className="mt-4 space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>
                                            {new Date(training.start_date).toLocaleDateString('fr-FR')}
                                            {' - '}
                                            {new Date(training.end_date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    {training.location && (
                                        <div className="flex items-center space-x-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{training.location}</span>
                                        </div>
                                    )}
                                    {training.trainer && (
                                        <div className="flex items-center space-x-2">
                                            <UserGroupIcon className="h-4 w-4" />
                                            <span>Formateur: {training.trainer}</span>
                                        </div>
                                    )}
                                    {training.cost > 0 && (
                                        <div className="flex items-center space-x-2">
                                            <CurrencyDollarIcon className="h-4 w-4" />
                                            <span>{training.cost.toLocaleString()} FCFA</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        {training.participants?.length || 0} participant(s)
                                        {training.max_participants && ` / ${training.max_participants}`}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEnroll(training.id)}
                                            className="p-1 text-green-600 hover:text-green-900"
                                            title="S'inscrire"
                                        >
                                            <UserGroupIcon className="h-4 w-4" />
                                        </button>
                                        {training.status === 'ongoing' && (
                                            <button
                                                onClick={() => handleComplete(training.id)}
                                                className="p-1 text-blue-600 hover:text-blue-900"
                                                title="Valider la formation"
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        {hasPermission('edit_trainings') && (
                                            <button
                                                onClick={() => editTraining(training)}
                                                className="p-1 text-blue-600 hover:text-blue-900"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        {hasPermission('delete_trainings') && (
                                            <button
                                                onClick={() => handleDelete(training.id)}
                                                className="p-1 text-danger-600 hover:text-danger-900"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {trainings.length === 0 && (
                    <div className="text-center py-12">
                        <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="mt-2 text-gray-500">Aucune formation planifiée</p>
                        {hasPermission('create_trainings') && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-primary-600 hover:text-primary-700"
                            >
                                + Créer une formation
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Trainings;