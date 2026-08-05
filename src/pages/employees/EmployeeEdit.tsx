import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useForm } from 'react-hook-form';
import { employees } from '../../api/employees';
import axios from '../../api/axios';
import type { Employee } from '../../types';
import toast from 'react-hot-toast';

interface EmployeeFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department_id: string;
    position_id: string;
    hire_date: string;
    birth_date: string;
    gender: '' | 'male' | 'female' | 'other';
    marital_status: '' | 'single' | 'married' | 'divorced' | 'widowed';
    nationality: string;
    emergency_contact: string;
    emergency_phone: string;
    status: 'active' | 'on_leave' | 'terminated' | 'suspended';
}

const EmployeeEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<EmployeeFormData>();
    const departmentId = watch('department_id');
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);
    const [positions, setPositions] = useState<Array<{ id: number; title: string; department_id?: number }>>([]);

    useEffect(() => {
        Promise.all([
            fetchEmployee(),
            fetchOptions(),
        ]);
    }, [id]);

    const fetchOptions = async (): Promise<void> => {
        try {
            const [departmentsResponse, positionsResponse] = await Promise.all([
                axios.get('/departments'),
                axios.get('/positions', { params: { per_page: 100, is_active: 1 } }),
            ]);
            setDepartments(departmentsResponse.data);
            setPositions(positionsResponse.data.data || []);
        } catch {
            toast.error('Erreur lors du chargement des départements et postes');
        }
    };

    const fetchEmployee = async (): Promise<void> => {
        try {
            const response = await employees.show(Number(id));
            const employee = response.data.employee as Employee;
            reset({
                first_name: employee.user?.first_name || '',
                last_name: employee.user?.last_name || '',
                email: employee.user?.email || '',
                phone: employee.user?.phone || '',
                department_id: String(employee.department_id || ''),
                position_id: String(employee.position_id || ''),
                hire_date: employee.hire_date,
                birth_date: employee.birth_date || '',
                gender: employee.gender || '',
                marital_status: employee.marital_status || '',
                nationality: employee.nationality || '',
                emergency_contact: employee.emergency_contact || '',
                emergency_phone: employee.emergency_phone || '',
                status: employee.status,
            });
        } catch (error) {
            toast.error('Erreur lors du chargement de l\'employé');
            navigate('/employees');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: EmployeeFormData): Promise<void> => {
        setSaving(true);
        try {
            await employees.update(Number(id), data);
            toast.success('Employé mis à jour avec succès');
            navigate('/employees');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Modifier l'employé</h1>
                        <p className="text-gray-500 mt-1">Mettre à jour les informations de l'employé</p>
                    </div>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                                <input
                                    {...register('first_name', { required: 'Le prénom est requis' })}
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {errors.first_name && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input
                                    {...register('last_name', { required: 'Le nom est requis' })}
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {errors.last_name && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    {...register('email', {
                                        required: 'L\'email est requis',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email invalide',
                                        },
                                    })}
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {errors.email && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Statut</label>
                                <select
                                    {...register('status')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="active">Actif</option>
                                    <option value="on_leave">En congé</option>
                                    <option value="terminated">Terminé</option>
                                    <option value="suspended">Suspendu</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date d'embauche *</label>
                                <input
                                    {...register('hire_date', { required: 'La date d\'embauche est requise' })}
                                    type="date"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {errors.hire_date && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.hire_date.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                <input
                                    {...register('birth_date')}
                                    type="date"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Genre</label>
                                <select
                                    {...register('gender')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="male">Homme</option>
                                    <option value="female">Femme</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Situation matrimoniale</label>
                                <select
                                    {...register('marital_status')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="single">Célibataire</option>
                                    <option value="married">Marié(e)</option>
                                    <option value="divorced">Divorcé(e)</option>
                                    <option value="widowed">Veuf/Veuve</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nationalité</label>
                                <input
                                    {...register('nationality')}
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 mt-4">Contact d'urgence</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom du contact</label>
                                <input
                                    {...register('emergency_contact')}
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone du contact</label>
                                <input
                                    {...register('emergency_phone')}
                                    type="tel"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 mt-4">Département et poste</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Département</label>
                                <select
                                    {...register('department_id')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner un département</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Poste</label>
                                <select
                                    {...register('position_id')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner un poste</option>
                                    {positions
                                        .filter((position) => !departmentId || String(position.department_id) === departmentId)
                                        .map((position) => (
                                            <option key={position.id} value={position.id}>{position.title}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/employees')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default EmployeeEdit;