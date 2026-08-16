import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useForm } from 'react-hook-form';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

interface ContractFormData {
    employee_id: string;
    type: 'cdi' | 'cdd' | 'stage' | 'consultant' | 'freelance';
    start_date: string;
    end_date: string;
    probation_end_date: string;
    base_salary: string;
    currency: string;
    terms: string;
}

interface EmployeeOption {
    id: number;
    employee_number: string;
    user?: { first_name: string; last_name: string };
}

const emptyValues: ContractFormData = {
    employee_id: '',
    type: 'cdi',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: '',
    probation_end_date: '',
    base_salary: '',
    currency: 'XOF',
    terms: '',
};

const ContractCreate: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ContractFormData>({
        defaultValues: emptyValues,
    });

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [saving, setSaving] = useState(false);
    const [employeesOptions, setEmployeesOptions] = useState<EmployeeOption[]>([]);
    const [contractFile, setContractFile] = useState<File | null>(null);

    const contractType = watch('type');

    useEffect(() => {
        const loadOptions = async (): Promise<void> => {
            try {
                const response = await axios.get('/employees', { params: { per_page: 200, status: 'active' } });
                setEmployeesOptions(response.data.data || []);
            } catch {
                toast.error('Impossible de charger la liste des employés');
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    const onSubmit = async (data: ContractFormData): Promise<void> => {
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('employee_id', data.employee_id);
            formData.append('type', data.type);
            formData.append('start_date', data.start_date);
            formData.append('base_salary', String(Number(data.base_salary)));
            formData.append('currency', data.currency);
            if (data.end_date) formData.append('end_date', data.end_date);
            if (data.probation_end_date) formData.append('probation_end_date', data.probation_end_date);
            if (data.terms) formData.append('terms', data.terms);
            if (contractFile) formData.append('contract_file', contractFile);

            await axios.post('/contracts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Contrat créé avec succès');
            navigate('/contracts');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création du contrat');
        } finally {
            setSaving(false);
        }
    };

    if (loadingOptions) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Nouveau contrat</h1>
                <p className="text-gray-500 mt-1">Créer un contrat de travail pour un employé</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Employé *</label>
                            <select
                                {...register('employee_id', { required: "L'employé est requis" })}
                                className="field"
                            >
                                <option value="">Sélectionner un employé</option>
                                {employeesOptions.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.user?.first_name} {employee.user?.last_name} ({employee.employee_number})
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && <p className="error">{errors.employee_id.message}</p>}
                        </div>

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
                            <label className="block text-sm font-medium text-gray-700">Devise *</label>
                            <select {...register('currency', { required: true })} className="field">
                                <option value="XOF">FCFA (XOF)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="USD">Dollar (USD)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de début *</label>
                            <input
                                {...register('start_date', { required: 'La date de début est requise' })}
                                type="date"
                                className="field"
                            />
                            {errors.start_date && <p className="error">{errors.start_date.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date de fin {contractType === 'cdd' || contractType === 'stage' ? '*' : '(optionnel)'}
                            </label>
                            <input {...register('end_date')} type="date" className="field" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fin de période d'essai</label>
                            <input {...register('probation_end_date')} type="date" className="field" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Salaire de base *</label>
                            <input
                                {...register('base_salary', {
                                    required: 'Le salaire est requis',
                                    min: { value: 0, message: 'Le salaire doit être positif' },
                                })}
                                type="number"
                                step="0.01"
                                className="field"
                                placeholder="Ex: 250000"
                            />
                            {errors.base_salary && <p className="error">{errors.base_salary.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Clauses / observations</label>
                            <textarea {...register('terms')} rows={4} className="field" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Contrat signé (optionnel)</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => setContractFile(e.target.files?.[0] || null)}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
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
                            {saving ? 'Création...' : 'Créer le contrat'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ContractCreate;