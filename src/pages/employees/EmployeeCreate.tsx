import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useForm } from 'react-hook-form';
import { employees } from '../../api/employees';
import axios from '../../api/axios';
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
}

interface DepartmentOption {
    id: number;
    name: string;
}

interface PositionOption {
    id: number;
    title: string;
    department_id?: number;
}

const emptyValues: EmployeeFormData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    hire_date: new Date().toISOString().slice(0, 10),
    birth_date: '',
    gender: '',
    marital_status: '',
    nationality: 'Béninoise',
    emergency_contact: '',
    emergency_phone: '',
};

const EmployeeCreate: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<EmployeeFormData>({
        defaultValues: emptyValues,
    });

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [saving, setSaving] = useState(false);
    const [departments, setDepartments] = useState<DepartmentOption[]>([]);
    const [positions, setPositions] = useState<PositionOption[]>([]);

    const departmentId = watch('department_id');

    const filteredPositions = useMemo(
        () => positions.filter((position) => !departmentId || String(position.department_id) === departmentId),
        [positions, departmentId]
    );

    useEffect(() => {
        const loadOptions = async (): Promise<void> => {
            try {
                const [departmentsResponse, positionsResponse] = await Promise.all([
                    axios.get('/departments'),
                    axios.get('/positions', { params: { per_page: 100, is_active: 1 } }),
                ]);

                setDepartments(departmentsResponse.data);
                setPositions(positionsResponse.data.data || []);
            } catch {
                toast.error('Impossible de charger les départements et postes');
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    const onSubmit = async (data: EmployeeFormData): Promise<void> => {
        setSaving(true);

        try {
            await employees.create(data);
            toast.success('Employé créé avec succès. Un lien de définition du mot de passe sera envoyé par email.');
            navigate('/employees');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setSaving(false);
        }
    };

    if (loadingOptions) {
        return <Loading fullScreen />;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nouvel employé</h1>
                    <p className="text-gray-500 mt-1">Créer le dossier RH d'un nouvel employé</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                                <input {...register('first_name', { required: 'Le prénom est requis' })} type="text" className="field" />
                                {errors.first_name && <p className="error">{errors.first_name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input {...register('last_name', { required: 'Le nom est requis' })} type="text" className="field" />
                                {errors.last_name && <p className="error">{errors.last_name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    {...register('email', {
                                        required: 'L email est requis',
                                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email invalide' },
                                    })}
                                    type="email"
                                    className="field"
                                />
                                {errors.email && <p className="error">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input {...register('phone')} type="tel" className="field" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Date d'embauche *
                                </label>

                                <input
                                    {...register('hire_date', {
                                        required: "La date d'embauche est requise"
                                    })}
                                    type="date"
                                    className="field"
                                />

                                {errors.hire_date && (
                                    <p className="error">{errors.hire_date.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                <input {...register('birth_date')} type="date" className="field" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Genre</label>
                                <select {...register('gender')} className="field">
                                    <option value="">Sélectionner</option>
                                    <option value="male">Homme</option>
                                    <option value="female">Femme</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Situation matrimoniale</label>
                                <select {...register('marital_status')} className="field">
                                    <option value="">Sélectionner</option>
                                    <option value="single">Célibataire</option>
                                    <option value="married">Marié(e)</option>
                                    <option value="divorced">Divorcé(e)</option>
                                    <option value="widowed">Veuf/Veuve</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nationalité</label>
                                <input {...register('nationality')} type="text" className="field" />
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900">Affectation</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Département</label>
                                <select {...register('department_id')} className="field">
                                    <option value="">Sélectionner un département</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Poste</label>
                                <select {...register('position_id')} className="field">
                                    <option value="">Sélectionner un poste</option>
                                    {filteredPositions.map((position) => (
                                        <option key={position.id} value={position.id}>{position.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900">Contact d'urgence</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom du contact</label>
                                <input {...register('emergency_contact')} type="text" className="field" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone du contact</label>
                                <input {...register('emergency_phone')} type="tel" className="field" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <button type="button" onClick={() => navigate('/employees')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50">
                                {saving ? 'Création...' : 'Créer l’employé'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default EmployeeCreate;
