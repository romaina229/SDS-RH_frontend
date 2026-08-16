import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import {
    DocumentTextIcon,
    UsersIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

type ReportType = 'employees' | 'attendance' | 'payroll' | 'leaves';

const MIME_TYPES: Record<'pdf' | 'excel', string> = {
    pdf: 'application/pdf',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const EXTENSIONS: Record<'pdf' | 'excel', string> = {
    pdf: 'pdf',
    excel: 'xlsx',
};

const Reports: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [reportType, setReportType] = useState<ReportType>('employees');
    const [dateRange, setDateRange] = useState({
        start_date: new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
    });
    const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');

    const reports = [
        { type: 'employees', label: 'Employés', icon: UsersIcon, permission: 'view_employees' },
        { type: 'attendance', label: 'Présences', icon: CalendarIcon, permission: 'view_employees' },
        { type: 'payroll', label: 'Paie', icon: CurrencyDollarIcon, permission: 'view_payrolls' },
        { type: 'leaves', label: 'Congés', icon: ChartBarIcon, permission: 'view_leaves' },
    ];

    const generateReport = async (): Promise<void> => {
        if (reportType !== 'payroll' && new Date(dateRange.start_date) > new Date(dateRange.end_date)) {
            toast.error('La date de début doit précéder la date de fin');
            return;
        }

        setLoading(true);

        try {
            const params = reportType === 'payroll'
                ? { month, format }
                : { ...dateRange, format };

            const response = await axios.get(`/reports/${reportType}`, {
                params,
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: MIME_TYPES[format] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const period = reportType === 'payroll' ? month : `${dateRange.start_date}_${dateRange.end_date}`;
            link.download = `rapport_${reportType}_${period}.${EXTENSIONS[format]}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(`Rapport ${format === 'pdf' ? 'PDF' : 'Excel'} généré avec succès`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la génération du rapport');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
                <p className="text-gray-500 mt-1">Génération de rapports RH</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sélection du rapport */}
                <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Type de rapport</h3>
                    <div className="space-y-2">
                        {reports.map((report) => {
                            if (report.permission && !hasPermission(report.permission)) {
                                return null;
                            }
                            return (
                                <button
                                    type="button"
                                    key={report.type}
                                    onClick={() => setReportType(report.type as ReportType)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        reportType === report.type
                                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <report.icon className="h-5 w-5" />
                                    <span className="font-medium">{report.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Paramètres */}
                <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres</h3>
                    <div className="space-y-4">
                        {reportType === 'payroll' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mois</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                                    <input
                                        type="date"
                                        value={dateRange.start_date}
                                        onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                                    <input
                                        type="date"
                                        value={dateRange.end_date}
                                        onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Format</label>
                            <div className="flex space-x-4 mt-1">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="pdf"
                                        checked={format === 'pdf'}
                                        onChange={() => setFormat('pdf')}
                                        className="form-radio text-primary-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">PDF</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="excel"
                                        checked={format === 'excel'}
                                        onChange={() => setFormat('excel')}
                                        className="form-radio text-primary-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Excel (.xlsx)</span>
                                </label>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={generateReport}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Génération en cours...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                                    Générer le rapport
                                </span>
                            )}
                        </button>
                    </div>
                </Card>
            </div>

            {/* Aperçu des rapports disponibles */}
            <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rapports disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <UsersIcon className="h-8 w-8 text-primary-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Employés</h4>
                        <p className="text-sm text-gray-500">Liste complète des employés</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <CalendarIcon className="h-8 w-8 text-green-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Présences</h4>
                        <p className="text-sm text-gray-500">Statistiques de présence</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Paie</h4>
                        <p className="text-sm text-gray-500">Rapport des salaires</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <ChartBarIcon className="h-8 w-8 text-yellow-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Congés</h4>
                        <p className="text-sm text-gray-500">Analyse des congés</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
