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
    const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');

    const reports = [
        { type: 'employees', label: 'Employés', icon: UsersIcon, permission: 'view_employees' },
        { type: 'attendance', label: 'Présences', icon: CalendarIcon, permission: 'view_employees' },
        { type: 'payroll', label: 'Paie', icon: CurrencyDollarIcon, permission: 'view_payrolls' },
        { type: 'leaves', label: 'Congés', icon: ChartBarIcon, permission: 'view_leaves' },
    ];

    const escapeHtml = (value: unknown): string =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    const generateReport = async (): Promise<void> => {
        if (new Date(dateRange.start_date) > new Date(dateRange.end_date)) {
            toast.error('La date de début doit précéder la date de fin');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(`/reports/${reportType}`, {
                params: {
                    ...dateRange,
                    format,
                },
            });

            const payload = response.data;
            const rows = payload[reportType] || [];

            if (format === 'excel') {
                const normalizedRows = rows.map((row: Record<string, unknown>) => ({
                    id: row.id ?? '',
                    nom: row.user
                        ? `${(row.user as Record<string, unknown>).first_name ?? ''} ${(row.user as Record<string, unknown>).last_name ?? ''}`.trim()
                        : row.employee_id ?? '',
                    departement: row.department
                        ? (row.department as Record<string, unknown>).name ?? ''
                        : '',
                    statut: row.status ?? '',
                    date: row.date ?? row.hire_date ?? row.start_date ?? row.month ?? '',
                }));

                const headers = Object.keys(normalizedRows[0] || {
                    id: '',
                    nom: '',
                    departement: '',
                    statut: '',
                    date: '',
                });

                const csv = [
                    headers.join(';'),
                    ...normalizedRows.map((row: Record<string, unknown>) =>
                        headers.map((header) =>
                            `"${String(row[header] ?? '').replace(/"/g, '""')}"`
                        ).join(';')
                    ),
                ].join('\n');

                const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `rapport_${reportType}_${dateRange.start_date}_${dateRange.end_date}.csv`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                toast.success('Rapport Excel/CSV généré avec succès');
                return;
            }

            const printable = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800');

            if (!printable) {
                toast.error('Autorisez les fenêtres contextuelles pour imprimer le rapport');
                return;
            }

            const title = reports.find((report) => report.type === reportType)?.label || 'Rapport';
            const summary = payload.summary
                ? `<pre>${JSON.stringify(payload.summary, null, 2)}</pre>`
                : '';

            const tableRows = rows.slice(0, 500).map((row: Record<string, unknown>) => `
                <tr>
                    <td>${escapeHtml(row.id)}</td>
                    <td>${escapeHtml(row.user ? `${String((row.user as Record<string, unknown>).first_name ?? '')} ${String((row.user as Record<string, unknown>).last_name ?? '')}` : '')}</td>
                    <td>${escapeHtml(row.status)}</td>
                    <td>${escapeHtml(row.date ?? row.hire_date ?? row.start_date ?? row.month ?? '')}</td>
                </tr>
            `).join('');

            printable.document.write(`
                <!doctype html>
                <html lang="fr">
                <head>
                    <meta charset="utf-8">
                    <title>${title} — SDS-RH</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; color: #111827; }
                        h1 { margin-bottom: 4px; }
                        .muted { color: #6b7280; margin-bottom: 24px; }
                        pre { background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap; }
                        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                        th { background: #f3f4f6; }
                        @media print { body { margin: 15mm; } }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <div class="muted">SDS-RH · ${dateRange.start_date} au ${dateRange.end_date}</div>
                    ${summary}
                    <table>
                        <thead><tr><th>ID</th><th>Employé</th><th>Statut</th><th>Date/Période</th></tr></thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </body>
                </html>
            `);
            printable.document.close();
            printable.focus();
            printable.onload = () => printable.print();

            toast.success('Rapport prêt à être enregistré en PDF');
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de début</label>
                            <input
                                type="date"
                                value={dateRange.start_date}
                                onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                            <input
                                type="date"
                                value={dateRange.end_date}
                                onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
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
                                    <span className="ml-2 text-sm text-gray-700">Excel (CSV)</span>
                                </label>
                            </div>
                        </div>
                        <button
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