import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import type { Employee } from '../../types';
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
    const {isAdmin, isManager } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<LeaveFormData>();
    const [loading, setLoading] = useState<boolean>(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [balance, setBalance] = useState<any>(null);

    const startDate = watch('start_date');
    const endDate = watch('end_date');
    const selectedEmployee = watch('employee_id');

    useEffect(() => {
        if (isAdmin || isManager) {
            fetchEmployees();
        }
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchBalance(Number(selectedEmployee));
        }
    }, [selectedEmployee]);

    const fetchEmployees = async (): Promise<void> => {
        try {
            const response = await axios.get('/employees', { params: { per_page: 100 } });
            setEmployees(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des employés');
        }
    };

    const fetchBalance = async (employeeId: number): Promise<void> => {
        try {
            const response = await axios.get(`/leaves/balance/${employeeId}`);
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Erreur lors du chargement du solde', error);
        }
    };

    const calculateDays = (start: string, end: string): number => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const onSubmit = async (data: LeaveFormData): Promise<void> => {
        const days = calculateDays(data.start_date, data.end_date);
        
        // Vérifier le solde pour les congés annuels
        if (data.type === 'annual' && balance) {
            if (balance.annual_remaining < days) {
                toast.error(`Solde insuffisant. Restant: ${balance.annual_remaining} jours`);
                return;
            }
        }

        setLoading(true);
        try {
            await axios.post('/leaves', { ...data, days });
            toast.success('Demande de congé créée avec succès');
            navigate('/leaves');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    const days = calculateDays(startDate, endDate);

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Demander un congé</h1>
                    <p className="text-gray-500 mt-1">Soumettez une demande de congé</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(isAdmin || isManager) && (
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

                            {days > 0 && (
                                <div className="col-span-2 bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">{days}</span> jour(s) de congé demandé(s)
                                    </p>
                                    {balance && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Solde restant: <span className="font-medium">{balance.annual_remaining}</span> jours
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
        </Layout>
    );
};

export default LeaveCreate;