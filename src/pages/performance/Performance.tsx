import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { performance } from '../../api/performance';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import type { Goal, Performance as PerformanceReview } from '../../types';
import { PlusIcon, TrashIcon, FlagIcon, StarIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

interface EmployeeOption {
    id: number;
    employee_number: string;
    user?: { first_name: string; last_name: string };
}

interface GoalFormData {
    employee_id: string;
    title: string;
    description: string;
    category: string;
    target: string;
    start_date: string;
    end_date: string;
    priority: 'low' | 'medium' | 'high';
}

interface ReviewFormData {
    employee_id: string;
    period: string;
    strengths: string;
    weaknesses: string;
    achievements: string;
    recommendations: string;
    overall_score: string;
}

const priorityLabel: Record<string, string> = { low: 'Basse', medium: 'Moyenne', high: 'Haute' };
const priorityColor: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
};
const goalStatusLabel: Record<string, string> = {
    not_started: 'Non démarré',
    in_progress: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé',
};
const reviewStatusLabel: Record<string, string> = {
    draft: 'Brouillon',
    submitted: 'Soumise',
    reviewed: 'Examinée',
    approved: 'Approuvée',
};

const PerformancePage: React.FC = () => {
    const { hasPermission } = useAuth();
    const [tab, setTab] = useState<'goals' | 'reviews'>('goals');
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [reviews, setReviews] = useState<PerformanceReview[]>([]);
    const [employeesOptions, setEmployeesOptions] = useState<EmployeeOption[]>([]);
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const goalForm = useForm<GoalFormData>({
        defaultValues: { priority: 'medium', start_date: new Date().toISOString().slice(0, 10) },
    });
    const reviewForm = useForm<ReviewFormData>();

    const fetchAll = async (): Promise<void> => {
        try {
            const [goalsRes, reviewsRes, employeesRes] = await Promise.all([
                performance.goals.list({ per_page: 50 }),
                performance.reviews.list({ per_page: 50 }),
                axios.get('/employees', { params: { per_page: 200, status: 'active' } }),
            ]);
            setGoals(goalsRes.data.data || []);
            setReviews(reviewsRes.data.data || []);
            setEmployeesOptions(employeesRes.data.data || []);
        } catch {
            toast.error('Erreur lors du chargement du module Performance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const onSubmitGoal = async (data: GoalFormData): Promise<void> => {
        try {
            await performance.goals.create({ ...data, target: data.target ? Number(data.target) : null });
            toast.success('Objectif créé avec succès');
            goalForm.reset();
            setShowGoalForm(false);
            fetchAll();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la création de l'objectif");
        }
    };

    const onSubmitReview = async (data: ReviewFormData): Promise<void> => {
        try {
            await performance.reviews.create({
                ...data,
                overall_score: data.overall_score ? Number(data.overall_score) : null,
            });
            toast.success('Évaluation créée avec succès');
            reviewForm.reset();
            setShowReviewForm(false);
            fetchAll();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la création de l'évaluation");
        }
    };

    const deleteGoal = async (id: number): Promise<void> => {
        if (!confirm('Supprimer cet objectif ?')) return;
        try {
            await performance.goals.delete(id);
            toast.success('Objectif supprimé');
            fetchAll();
        } catch {
            toast.error('Erreur lors de la suppression');
        }
    };

    const deleteReview = async (id: number): Promise<void> => {
        if (!confirm('Supprimer cette évaluation ?')) return;
        try {
            await performance.reviews.delete(id);
            toast.success('Évaluation supprimée');
            fetchAll();
        } catch {
            toast.error('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
                    <p className="text-gray-500 mt-1">Objectifs, indicateurs clés et évaluations des employés</p>
                </div>
            </div>

            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setTab('goals')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        tab === 'goals' 
                            ? 'border-primary-600 text-primary-700' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FlagIcon className="h-4 w-4 inline mr-2" />
                    Objectifs
                </button>
                <button
                    onClick={() => setTab('reviews')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        tab === 'reviews' 
                            ? 'border-primary-600 text-primary-700' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <StarIcon className="h-4 w-4 inline mr-2" />
                    Évaluations
                </button>
            </div>

            {tab === 'goals' && (
                <div className="space-y-6">
                    {hasPermission('create_performances') && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowGoalForm((v) => !v)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Nouvel objectif
                            </button>
                        </div>
                    )}

                    {showGoalForm && (
                        <Card title="Nouvel objectif">
                            <form onSubmit={goalForm.handleSubmit(onSubmitGoal)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Employé *</label>
                                        <select {...goalForm.register('employee_id', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                            <option value="">Sélectionner un employé</option>
                                            {employeesOptions.map((e) => (
                                                <option key={e.id} value={e.id}>
                                                    {e.user?.first_name} {e.user?.last_name} ({e.employee_number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Titre *</label>
                                        <input {...goalForm.register('title', { required: true })} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Ex: Augmenter le taux de satisfaction client" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea {...goalForm.register('description')} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                                        <input {...goalForm.register('category')} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Ex: Commercial, Technique..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cible (valeur)</label>
                                        <input {...goalForm.register('target')} type="number" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priorité</label>
                                        <select {...goalForm.register('priority')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                            <option value="low">Basse</option>
                                            <option value="medium">Moyenne</option>
                                            <option value="high">Haute</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date de début *</label>
                                        <input {...goalForm.register('start_date', { required: true })} type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date de fin *</label>
                                        <input {...goalForm.register('end_date', { required: true })} type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button type="button" onClick={() => setShowGoalForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                        Annuler
                                    </button>
                                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                                        Créer l'objectif
                                    </button>
                                </div>
                            </form>
                        </Card>
                    )}

                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {goals.length === 0 && (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">Aucun objectif pour le moment.</td></tr>
                                    )}
                                    {goals.map((goal) => {
                                        const rate = goal.target ? Math.min(100, Math.round((goal.progress / goal.target) * 100)) : 0;
                                        return (
                                            <tr key={goal.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {goal.employee?.user?.first_name} {goal.employee?.user?.last_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{goal.title}</div>
                                                    {goal.category && <div className="text-xs text-gray-500">{goal.category}</div>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div className="bg-secondary-500 h-2 rounded-full transition-all" style={{ width: `${rate}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-500">{rate}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColor[goal.priority]}`}>
                                                        {priorityLabel[goal.priority]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {goalStatusLabel[goal.status]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                    {hasPermission('edit_performances') && goal.status === 'not_started' && (
                                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {hasPermission('delete_performances') && (
                                                        <button onClick={() => deleteGoal(goal.id)} className="text-danger-600 hover:text-danger-900">
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {tab === 'reviews' && (
                <div className="space-y-6">
                    {hasPermission('create_performances') && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowReviewForm((v) => !v)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Nouvelle évaluation
                            </button>
                        </div>
                    )}

                    {showReviewForm && (
                        <Card title="Nouvelle évaluation">
                            <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Employé *</label>
                                        <select {...reviewForm.register('employee_id', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                            <option value="">Sélectionner un employé</option>
                                            {employeesOptions.map((e) => (
                                                <option key={e.id} value={e.id}>
                                                    {e.user?.first_name} {e.user?.last_name} ({e.employee_number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Période *</label>
                                        <input {...reviewForm.register('period', { required: true })} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Ex: 2026-S1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Note globale (/20)</label>
                                        <input {...reviewForm.register('overall_score')} type="number" step="0.5" min={0} max={20} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Points forts</label>
                                        <textarea {...reviewForm.register('strengths')} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Axes d'amélioration</label>
                                        <textarea {...reviewForm.register('weaknesses')} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Réalisations</label>
                                        <textarea {...reviewForm.register('achievements')} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Recommandations</label>
                                        <textarea {...reviewForm.register('recommendations')} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                        Annuler
                                    </button>
                                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                                        Créer l'évaluation
                                    </button>
                                </div>
                            </form>
                        </Card>
                    )}

                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Évaluateur</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reviews.length === 0 && (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">Aucune évaluation pour le moment.</td></tr>
                                    )}
                                    {reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {review.employee?.user?.first_name} {review.employee?.user?.last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {review.reviewer?.user?.first_name} {review.reviewer?.user?.last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.period}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {review.overall_score ? `${review.overall_score}/20` : '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {reviewStatusLabel[review.status]}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                {hasPermission('edit_performances') && review.status === 'draft' && (
                                                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {hasPermission('delete_performances') && (
                                                    <button onClick={() => deleteReview(review.id)} className="text-danger-600 hover:text-danger-900">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PerformancePage;