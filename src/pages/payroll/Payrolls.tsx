import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Payroll } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { buildPayslipHtml } from './paysliptemplate';
import { CurrencyDollarIcon, ArrowDownTrayIcon as DownloadIcon, CheckIcon } from '@heroicons/react/24/outline';

const Payrolls: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [month, setMonth] = useState<string>(
        new Date().toISOString().slice(0, 7)
    );
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        fetchPayrolls();
    }, [month]);

    const fetchPayrolls = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get('/payrolls', { params: { month } });
            setPayrolls(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des paies');
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
            fetchPayrolls();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du traitement');
        } finally {
            setProcessing(false);
        }
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

    return (
        <Layout>
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
                            <button
                                onClick={processPayroll}
                                disabled={processing}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium disabled:opacity-50"
                            >
                                {processing ? 'Traitement...' : 'Traiter la paie'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {payrolls.length}
                                </p>
                            </div>
                            <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Masse salariale</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {payrolls.reduce((sum, p) => sum + p.net_salary, 0).toLocaleString()} FCFA
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
                                    {payrolls.filter(p => p.status === 'paid').length}/{payrolls.length}
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
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employé
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Salaire de base
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Primes
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Déductions
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Net
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
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
                                            {payroll.base_salary.toLocaleString()} FCFA
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                            +{payroll.bonuses.toLocaleString()} FCFA
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                            -{payroll.deductions.toLocaleString()} FCFA
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {payroll.net_salary.toLocaleString()} FCFA
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
            </div>
        </Layout>
    );
};

export default Payrolls;