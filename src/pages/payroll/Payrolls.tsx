import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Payroll, Employee } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { buildPayslipHtml } from './paysliptemplate';
import { 
    CurrencyDollarIcon, 
    ArrowDownTrayIcon as DownloadIcon, 
    CheckIcon, 
    PencilIcon,
} from '@heroicons/react/24/outline';

interface PreparedPayroll {
    employee_id: number;
    employee: Employee;
    contract_id: number;
    base_salary: number;
    overtime_hours: number;
    overtime_amount: number;
    bonuses: number;
    deductions: number;
    additional_deductions: number;
    cnss: number;
    ipm: number;
    net_salary: number;
    status: string;
    breakdown: any[];
}

const formatCurrency = (value: number): string => {
    if (!value || isNaN(value)) return '0 FCFA';
    return Math.round(value).toLocaleString('fr-FR') + ' FCFA';
};

const Payrolls: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [preparedPayrolls, setPreparedPayrolls] = useState<PreparedPayroll[]>([]);
    const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [processing, setProcessing] = useState<boolean>(false);
    const [showAdjustments, setShowAdjustments] = useState<boolean>(false);
    const [editingEmployee, setEditingEmployee] = useState<number | null>(null);
    const [adjustments, setAdjustments] = useState<Record<number, any>>({});
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    // Déclarer fetchPayrolls en premier
    const fetchPayrolls = async (page = 1): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get('/payrolls', { 
                params: { month, page, per_page: 15 } 
            });
            setPayrolls(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
            });
        } catch (error) {
            toast.error('Erreur lors du chargement des paies');
        } finally {
            setLoading(false);
        }
    };

    // Ensuite utiliser useEffect
    useEffect(() => {
        if (showAdjustments) {
            fetchPreparedPayrolls();
        } else {
            fetchPayrolls();
        }
    }, [month, showAdjustments]);

    const fetchPreparedPayrolls = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get('/payrolls/prepare', { params: { month } });
            setPreparedPayrolls(response.data.employees);
            const initialAdjustments: Record<number, any> = {};
            response.data.employees.forEach((emp: PreparedPayroll) => {
                initialAdjustments[emp.employee_id] = {
                    overtime_hours: emp.overtime_hours || 0,
                    bonuses: emp.bonuses || 0,
                    additional_deductions: emp.additional_deductions || 0,
                    notes: '',
                };
            });
            setAdjustments(initialAdjustments);
        } catch (error) {
            toast.error('Erreur lors de la préparation de la paie');
        } finally {
            setLoading(false);
        }
    };

    const processPayroll = async (): Promise<void> => {
        if (!confirm(`Lancer le traitement de la paie pour ${month} ?`)) return;
        setProcessing(true);
        try {
            await axios.post('/payrolls/process', { month });
            toast.success('Paie traitée avec succès');
            setShowAdjustments(false);
            fetchPayrolls();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du traitement');
        } finally {
            setProcessing(false);
        }
    };

    const validateAndProcess = async (): Promise<void> => {
        if (!confirm(`Confirmer le traitement de la paie pour ${month} avec les ajustements ?`)) return;
        setProcessing(true);
        try {
            for (const [employeeId, data] of Object.entries(adjustments)) {
                await axios.post('/payrolls/update-adjustment', {
                    employee_id: parseInt(employeeId),
                    month: month,
                    ...data,
                });
            }
            
            await axios.post('/payrolls/validate-process', { 
                month, 
                confirm: true 
            });
            
            toast.success('Paie traitée avec succès (ajustements appliqués)');
            setShowAdjustments(false);
            fetchPayrolls();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du traitement');
        } finally {
            setProcessing(false);
        }
    };

    const handleAdjustmentChange = (employeeId: number, field: string, value: number) => {
        setAdjustments(prev => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                [field]: value,
            }
        }));
    };

    const calculateNetSalary = (employee: PreparedPayroll, adj: any) => {
        const gross = employee.base_salary;
        const hourlyRate = gross / 173.33;
        const overtimeAmount = adj.overtime_hours * hourlyRate * 1.25;
        const totalDeductions = employee.cnss + employee.ipm + (adj.additional_deductions || 0);
        return gross + overtimeAmount + (adj.bonuses || 0) - totalDeductions;
    };

    const handlePay = async (id: number): Promise<void> => {
        try {
            await axios.post(`/payrolls/${id}/pay`);
            toast.success('Paiement effectué avec succès');
            fetchPayrolls();
        } catch (error) {
            toast.error('Erreur lors du paiement');
        }
    };

    const downloadPayslip = async (id: number): Promise<void> => {
        try {
            const response = await axios.get(`/payrolls/${id}/download`);
            const payroll: Payroll = response.data.payroll;

            const printWindow = window.open('', '_blank', 'width=900,height=1000');
            if (!printWindow) {
                toast.error('Autorisez les fenêtres contextuelles pour imprimer le bulletin');
                return;
            }

            printWindow.document.write(buildPayslipHtml(payroll));
            printWindow.document.close();
            printWindow.focus();
            
            setTimeout(() => {
                printWindow.print();
            }, 500);
        } catch (error) {
            toast.error('Erreur lors de la génération du bulletin');
        }
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800',
            processed: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            draft: 'Brouillon',
            processed: 'Traitée',
            paid: 'Payée',
        };
        return labels[status] || status;
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
        fetchPayrolls(page);
    }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Paie</h1>
                    <p className="text-gray-500 mt-1">Gestion des salaires et bulletins de paie</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {hasPermission('process_payrolls') && (
                        <>
                            <button
                                onClick={() => {
                                    setShowAdjustments(!showAdjustments);
                                    if (!showAdjustments) {
                                        fetchPreparedPayrolls();
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                                {showAdjustments ? 'Voir la paie' : 'Ajustements'}
                            </button>
                            <button
                                onClick={showAdjustments ? validateAndProcess : processPayroll}
                                disabled={processing}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium disabled:opacity-50"
                            >
                                {processing ? 'Traitement...' : (showAdjustments ? 'Valider et traiter' : 'Traiter la paie')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showAdjustments ? (
                // Vue avec ajustements
                <div className="space-y-4">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Ajustements individuels</h3>
                            <span className="text-sm text-gray-500">
                                {preparedPayrolls.length} employés · {formatCurrency(preparedPayrolls.reduce((sum, p) => sum + (Number(p.net_salary) || 0), 0))}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Employé</th>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Salaire base</th>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Heures sup.</th>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Primes</th>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Déduc. supp.</th>
                                        <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500">Net estimé</th>
                                        <th className="px-4 py-2 bg-gray-50 text-center text-xs font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {preparedPayrolls.map((emp) => {
                                        const adj = adjustments[emp.employee_id] || { overtime_hours: 0, bonuses: 0, additional_deductions: 0 };
                                        const netEstime = calculateNetSalary(emp, adj);
                                        const isEditing = editingEmployee === emp.employee_id;
                                        
                                        return (
                                            <tr key={emp.employee_id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="text-sm font-medium">
                                                        {emp.employee.user?.first_name} {emp.employee.user?.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {emp.employee.employee_number}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                    {formatCurrency(emp.base_salary)}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.5"
                                                            value={adj.overtime_hours || 0}
                                                            onChange={(e) => handleAdjustmentChange(emp.employee_id, 'overtime_hours', parseFloat(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm">{adj.overtime_hours || 0}h</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1000"
                                                            value={adj.bonuses || 0}
                                                            onChange={(e) => handleAdjustmentChange(emp.employee_id, 'bonuses', parseFloat(e.target.value) || 0)}
                                                            className="w-24 px-2 py-1 border rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-green-600">
                                                            +{formatCurrency(adj.bonuses || 0)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1000"
                                                            value={adj.additional_deductions || 0}
                                                            onChange={(e) => handleAdjustmentChange(emp.employee_id, 'additional_deductions', parseFloat(e.target.value) || 0)}
                                                            className="w-24 px-2 py-1 border rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-red-600">
                                                            -{formatCurrency(adj.additional_deductions || 0)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap font-semibold text-primary-600">
                                                    {formatCurrency(netEstime)}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                                    {isEditing ? (
                                                        <button
                                                            onClick={() => setEditingEmployee(null)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            <CheckIcon className="h-5 w-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setEditingEmployee(emp.employee_id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                            {/* PAGINATION */}
                            {pagination.total > pagination.per_page && (
                                <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Précédent
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Affichage de <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> à{' '}
                                                <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> sur{' '}
                                                <span className="font-medium">{pagination.total}</span> résultats
                                            </p>
                                        </div>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handlePageChange(1)}
                                                disabled={pagination.current_page === 1}
                                                className="px-3 py-1 text-sm rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 disabled:opacity-50"
                                            >
                                                Première
                                            </button>
                                            {[...Array(Math.min(pagination.last_page, 10))].map((_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-1 text-sm rounded-md ${
                                                            pagination.current_page === page
                                                                ? 'bg-primary-600 text-white'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            {pagination.last_page > 10 && (
                                                <span className="px-3 py-1 text-sm text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(pagination.last_page)}
                                                disabled={pagination.current_page === pagination.last_page}
                                                className="px-3 py-1 text-sm rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 disabled:opacity-50"
                                            >
                                                Dernière
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </Card>
                </div>
            ) : (
                // Vue standard de la paie
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{payrolls.length}</p>
                                </div>
                                <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Masse salariale</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {payrolls.length > 0 
                                            ? formatCurrency(payrolls.reduce((sum, p) => sum + (Number(p.net_salary) || 0), 0))
                                            : '0 FCFA'
                                        }
                                    </p>
                                </div>
                                <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Payés</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {payrolls.filter(p => p.status === 'paid').length}/{payrolls.length || 0}
                                    </p>
                                </div>
                                <CheckIcon className="h-8 w-8 text-blue-400" />
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire de base</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primes</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Déductions</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payrolls.map((payroll) => (
                                        <tr key={payroll.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {payroll.employee?.user?.first_name} {payroll.employee?.user?.last_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(payroll.base_salary)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                +{formatCurrency(payroll.bonuses)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                -{formatCurrency(payroll.deductions)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatCurrency(payroll.net_salary)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payroll.status)}`}>
                                                    {getStatusLabel(payroll.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => downloadPayslip(payroll.id)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <DownloadIcon className="h-5 w-5" />
                                                </button>
                                                {payroll.status === 'processed' && hasPermission('process_payrolls') && (
                                                    <button
                                                        onClick={() => handlePay(payroll.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <CheckIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Payrolls;