import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import type { Employee, LeaveBalance } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

interface LeaveFormData {
    employee_id: string;
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
}

const LeaveCreate: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAdmin, isManager } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<LeaveFormData>();
    const [loading, setLoading] = useState<boolean>(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [balance, setBalance] = useState<LeaveBalance | null>(null);
    const [attachment, setAttachment] = useState<File | null>(null);

    const canPickEmployee = isAdmin || isManager;
    const startDate = watch('start_date');
    const endDate = watch('end_date');
    const selectedEmployeeId = watch('employee_id');

    // Employé cible du solde affiché : celui sélectionné par RH/manager,
    // ou le compte connecté lui-même s'il s'agit d'un simple employé.
    const targetEmployeeId = canPickEmployee
        ? selectedEmployeeId
        : user?.employee?.id
            ? String(user.employee.id)
            : '';

    useEffect(() => {
        if (canPickEmployee) {
            axios.get('/employees', { params: { per_page: 100 } })
                .then((response) => setEmployees(response.data.data))
                .catch(() => toast.error('Erreur lors du chargement des employés'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canPickEmployee]);

    useEffect(() => {
        if (!targetEmployeeId) {
            setBalance(null);
            return;
        }
        axios.get(`/leaves/balance/${targetEmployeeId}`)
            .then((response) => setBalance(response.data.balance))
            .catch(() => setBalance(null));
    }, [targetEmployeeId]);

    const estimateDays = (start: string, end: string): number => {
        if (!start || !end) return 0;
        const startMs = new Date(start).getTime();
        const endMs = new Date(end).getTime();
        if (endMs < startMs) return 0;
        return Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
    };

    const estimatedDays = estimateDays(startDate, endDate);

    const onSubmit = async (data: LeaveFormData): Promise<void> => {
        // Un employé standard n'a pas de sélecteur : on utilise son propre
        // dossier. Un RH/manager doit avoir explicitement choisi un employé
        // dans le sélecteur — jamais son propre compte par défaut.
        const employeeId = canPickEmployee ? data.employee_id : user?.employee?.id;

        if (!employeeId) {
            toast.error(
                canPickEmployee
                    ? 'Veuillez sélectionner un employé'
                    : 'Vous devez être associé à un employé pour faire une demande'
            );
            return;
        }

        if (data.type === 'annual' && balance && estimatedDays > 0 && balance.annual_remaining < estimatedDays) {
            toast.error(`Solde insuffisant. Restant : ${balance.annual_remaining} jours`);
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('employee_id', String(employeeId));
            formData.append('type', data.type);
            formData.append('start_date', data.start_date);
            formData.append('end_date', data.end_date);
            if (data.reason) formData.append('reason', data.reason);
            if (attachment) formData.append('attachment', attachment);

            // Le nombre de jours définitif est toujours recalculé et
            // validé côté serveur ; on n'envoie pas d'estimation locale.
            await axios.post('/leaves', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Demande de congé créée avec succès');
            navigate('/leaves');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Demander un congé</h1>
                <p className="text-gray-500 mt-1">Soumettez une demande de congé</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {canPickEmployee && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Employé *</label>
                                <select
                                    {...register('employee_id', { required: 'Veuillez sélectionner un employé' })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner un employé</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.user?.first_name} {emp.user?.last_name} ({emp.employee_number})
                                        </option>
                                    ))}
                                </select>
                                {errors.employee_id && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.employee_id.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type de congé *</label>
                            <select
                                {...register('type', { required: 'Veuillez sélectionner un type' })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                                <option value="">Sélectionner</option>
                                <option value="annual">Annuel</option>
                                <option value="sick">Maladie</option>
                                <option value="maternity">Maternité</option>
                                <option value="paternity">Paternité</option>
                                <option value="exceptional">Exceptionnel</option>
                                <option value="unpaid">Sans solde</option>
                                <option value="training">Formation</option>
                            </select>
                            {errors.type && (
                                <p className="text-danger-500 text-xs mt-1">{errors.type.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de début *</label>
                            <input
                                {...register('start_date', { required: 'La date de début est requise' })}
                                type="date"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            {errors.start_date && (
                                <p className="text-danger-500 text-xs mt-1">{errors.start_date.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de fin *</label>
                            <input
                                {...register('end_date', { required: 'La date de fin est requise' })}
                                type="date"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            {errors.end_date && (
                                <p className="text-danger-500 text-xs mt-1">{errors.end_date.message}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Motif</label>
                            <textarea
                                {...register('reason')}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Expliquez brièvement le motif de votre demande..."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Pièce jointe (justificatif, optionnel)</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                            <p className="mt-1 text-xs text-gray-400">Formats acceptés : PDF, image ou document. 5 Mo maximum.</p>
                        </div>

                        {estimatedDays > 0 && (
                            <div className="col-span-2 bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">
                                    Estimation : <span className="font-medium">{estimatedDays}</span> jour(s) de congé
                                    <span className="text-xs text-gray-400"> (le nombre exact sera confirmé par le serveur)</span>
                                </p>
                                {balance && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Solde restant pour cet employé : <span className="font-medium">{balance.annual_remaining}</span> jours
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/leaves')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Envoi...' : 'Soumettre la demande'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LeaveCreate;
