import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { portal } from '../../api/portal';
import { buildPayslipHtml } from '../payroll/paysliptemplate';
import type { Payroll } from '../../types';
import toast from 'react-hot-toast';
import { ArrowDownTrayIcon as DownloadIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const formatCurrency = (value: number): string => {
    if (!value || isNaN(value)) return '0 FCFA';
    return Math.round(value).toLocaleString('fr-FR') + ' FCFA';
};

const statusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        draft: 'Brouillon',
        processed: 'En attente de paiement',
        paid: 'Payé',
    };
    return labels[status] || status;
};

const statusColor = (status: string): string => {
    const colors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-800',
        processed: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const MyPayslips: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [payslips, setPayslips] = useState<Payroll[]>([]);

    useEffect(() => {
        fetchPayslips();
    }, []);

    const fetchPayslips = async (): Promise<void> => {
        try {
            const response = await portal.payslips({ per_page: 50 });
            setPayslips(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement de vos bulletins');
        } finally {
            setLoading(false);
        }
    };

    const printPayslip = async (id: number): Promise<void> => {
        try {
            const response = await portal.payslip(id);
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
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la génération du bulletin');
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mes bulletins de paie</h1>
                    <p className="text-gray-500 mt-1">Consultez et imprimez l'historique de vos bulletins</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {payslips.map((payslip) => (
                        <Card key={payslip.id} className="hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-primary-50 rounded-lg">
                                        <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{payslip.month}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatCurrency(Number(payslip.net_salary))}
                                        </p>
                                        <span
                                            className={`mt-1 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor(
                                                payslip.status
                                            )}`}
                                        >
                                            {statusLabel(payslip.status)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => printPayslip(payslip.id)}
                                    className="p-1 text-primary-600 hover:text-primary-900"
                                    title="Imprimer / télécharger"
                                >
                                    <DownloadIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {payslips.length === 0 && (
                    <div className="text-center py-12">
                        <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="mt-2 text-gray-500">Aucun bulletin de paie disponible pour le moment</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyPayslips;