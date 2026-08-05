import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useForm } from 'react-hook-form';
import { contracts } from './Contracts';
import toast from 'react-hot-toast';

interface ContractFormData {
    type: 'cdi' | 'cdd' | 'stage' | 'consultant' | 'freelance';
    status: 'active' | 'expired' | 'terminated' | 'pending';
    start_date: string;
    end_date: string;
    probation_end_date: string;
    base_salary: string;
    currency: string;
    terms: string;
}

const ContractEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContractFormData>();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [employeeLabel, setEmployeeLabel] = useState('');

    useEffect(() => {
        const loadContract = async (): Promise<void> => {
            try {
                const response = await contracts.show(id as string);
                const contract = response.data.contract;

                reset({
                    type: contract.type,
                    status: contract.status,
                    start_date: contract.start_date?.slice(0, 10) ?? '',
                    end_date: contract.end_date?.slice(0, 10) ?? '',
                    probation_end_date: contract.probation_end_date?.slice(0, 10) ?? '',
                    base_salary: String(contract.base_salary ?? ''),
                    currency: contract.currency,
                    terms: contract.terms ?? '',
                });

                setEmployeeLabel(
                    `${contract.employee?.user?.first_name ?? ''} ${contract.employee?.user?.last_name ?? ''} (${contract.employee?.employee_number ?? ''})`
                );
            } catch {
                toast.error('Impossible de charger le contrat');
                navigate('/contracts');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadContract();
    }, [id]);

    const onSubmit = async (data: ContractFormData): Promise<void> => {
        setSaving(true);

        try {
            await contracts.update(id as string, {
                ...data,
                base_salary: Number(data.base_salary),
                end_date: data.end_date || null,
                probation_end_date: data.probation_end_date || null,
            });
            toast.success('Contrat mis à jour avec succès');
            navigate('/contracts');
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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le contrat</h1>
                    <p className="text-gray-500 mt-1">{employeeLabel}</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type de contrat *</label>
                                <select {...register('type', { required: true })} className="field">
                                    <option value="cdi">CDI</option>
                                    <option value="cdd">CDD</option>
                                    <option value="stage">Stage</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Statut *</label>
                                <select {...register('status', { required: true })} className="field">
                                    <option value="active">Actif</option>
                                    <option value="pending">En attente</option>
                                    <option value="expired">Expiré</option>
                                    <option value="terminated">Terminé</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Devise *</label>
                                <select {...register('currency', { required: true })} className="field">
                                    <option value="XOF">FCFA (XOF)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                    <option value="USD">Dollar (USD)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Salaire de base *</label>
                                <input
                                    {...register('base_salary', { required: 'Le salaire est requis', min: 0 })}
                                    type="number"
                                    step="0.01"
                                    className="field"
                                />
                                {errors.base_salary && <p className="error">{errors.base_salary.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date de début *</label>
                                <input {...register('start_date', { required: true })} type="date" className="field" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                                <input {...register('end_date')} type="date" className="field" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fin de période d'essai</label>
                                <input {...register('probation_end_date')} type="date" className="field" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Clauses / observations</label>
                                <textarea {...register('terms')} rows={4} className="field" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/contracts')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                                {saving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default ContractEdit;