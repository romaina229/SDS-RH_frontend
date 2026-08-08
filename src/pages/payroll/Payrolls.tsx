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

    const numberToFrenchWords = (n: number): string => {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
        'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

    const chunk = (num: number): string => {
        if (num === 0) return '';
        if (num < 20) return units[num];
        if (num < 100) {
            const t = Math.floor(num / 10), u = num % 10;
            if (t === 7 || t === 9) return tens[t] + '-' + units[10 + u];
            return tens[t] + (u ? (u === 1 && t !== 8 ? '-et-un' : '-' + units[u]) : (t === 8 ? 's' : ''));
        }
        const c = Math.floor(num / 100), r = num % 100;
        return (c > 1 ? units[c] + ' cent' + (r === 0 ? 's' : '') : 'cent') + (r ? ' ' + chunk(r) : '');
    };

    if (n === 0) return 'zéro';
    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const rest = n % 1000;

    let words = '';
    if (millions) words += (millions > 1 ? chunk(millions) + ' millions ' : 'un million ');
    if (thousands) words += (thousands > 1 ? chunk(thousands) + ' mille ' : 'mille ');
    if (rest) words += chunk(rest);
    return words.trim();
};

    const downloadPayslip = async (id: number): Promise<void> => {
        try {
            const response = await axios.get(`/payrolls/${id}/download`);
            const payroll = response.data.payroll;
            const employee = payroll.employee;
            const items: Array<{ code: string; label: string; gain: number | null; retenue: number | null; patronal?: boolean }> =
                payroll.breakdown || [];

            const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1000');
            if (!printWindow) {
                toast.error('Autorisez les fenêtres contextuelles pour imprimer le bulletin');
                return;
            }

            const escapeHtml = (v: unknown) => String(v ?? '')
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

            const qrData = `${window.location.origin}/verify/${payroll.qr_token || payroll.id}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(qrData)}`;

            const rows = items.map((it) => `
                <tr>
                    <td class="mono">${escapeHtml(it.code)}</td>
                    <td>${escapeHtml(it.label)}${it.patronal ? ' <span class="tag">(patronal)</span>' : ''}</td>
                    <td class="num">${it.gain != null ? it.gain.toLocaleString('fr-FR') : ''}</td>
                    <td class="num">${it.retenue != null ? it.retenue.toLocaleString('fr-FR') : ''}</td>
                </tr>
            `).join('');

            const totalGain = items.filter(i => i.gain != null).reduce((s, i) => s + (i.gain || 0), 0);
            const totalRetenue = items.filter(i => i.retenue != null && !i.patronal).reduce((s, i) => s + (i.retenue || 0), 0);

            printWindow.document.write(`
                <!doctype html><html lang="fr"><head><meta charset="utf-8">
                <title>Bulletin de paie — ${escapeHtml(employee?.user?.first_name)} ${escapeHtml(employee?.user?.last_name)}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 30px; color: #111827; font-size: 12.5px; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #191A3D; padding-bottom: 12px; margin-bottom: 16px; }
                    .header img { height: 56px; }
                    .org-name { font-weight: 700; font-size: 16px; }
                    .org-meta { color: #6b7280; font-size: 11px; }
                    h1 { font-size: 18px; margin: 10px 0 2px; }
                    .top-grid { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start; margin-bottom: 14px; }
                    .box { border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 14px; }
                    .id-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px 14px; margin: 10px 0; font-size: 11.5px; }
                    .id-grid div b { display: block; color: #6b7280; font-weight: 600; font-size: 10px; text-transform: uppercase; }
                    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
                    th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
                    th { background: #f3f4f6; font-size: 11px; text-transform: uppercase; }
                    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
                    .mono { font-family: monospace; }
                    .tag { color: #9ca3af; font-size: 10px; }
                    .totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
                    .totals .box b { display: block; font-size: 10px; color: #6b7280; text-transform: uppercase; }
                    .net { font-size: 20px; font-weight: 800; color: #065f46; }
                    .words { margin-top: 14px; font-style: italic; }
                    @media print { body { margin: 12mm; } }
                </style></head>
                <body>
                    <div class="header">
                        <div>
                            <div class="org-name">${escapeHtml(payroll.tenant?.name || 'SDS-RH')}</div>
                            <div class="org-meta">${escapeHtml(payroll.tenant?.address || '')}</div>
                            <div class="org-meta">${payroll.tenant?.ifu ? 'IFU: ' + escapeHtml(payroll.tenant.ifu) : ''}</div>
                        </div>
                        <img src="${qrUrl}" alt="QR" />
                    </div>

                    <h1>BULLETIN DE PAIE</h1>
                    <div class="org-meta">Salaire de : ${escapeHtml(payroll.month)}</div>

                    <div class="box" style="margin-top:10px;">
                        <div><b>${escapeHtml(employee?.user?.first_name)} ${escapeHtml(employee?.user?.last_name)}</b></div>
                        <div class="org-meta">${escapeHtml(employee?.user?.email)}</div>
                    </div>

                    <div class="id-grid box">
                        <div><b>Matricule</b>${escapeHtml(employee?.employee_number)}</div>
                        <div><b>Grade</b>${escapeHtml(employee?.position?.grade || '-')}</div>
                        <div><b>Situation</b>${escapeHtml(employee?.marital_status || '-')}</div>
                        <div><b>Enfants</b>${escapeHtml(employee?.children_count ?? 0)}</div>
                        <div style="grid-column: span 2"><b>Fonction</b>${escapeHtml(employee?.position?.title || '-')}</div>
                        <div style="grid-column: span 2"><b>Département</b>${escapeHtml(employee?.department?.name || '-')}</div>
                    </div>

                    <table>
                        <thead><tr><th>Code</th><th>Élément payé</th><th class="num">Gain</th><th class="num">Retenue</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>

                    <div class="totals">
                        <div class="box"><b>Payé à</b>${escapeHtml(employee?.bank_details?.bank_name || 'Espèces')}<br>${escapeHtml(employee?.bank_details?.account_number || '')}</div>
                        <div class="box"><b>Total gains / retenues</b>${totalGain.toLocaleString('fr-FR')} / ${totalRetenue.toLocaleString('fr-FR')} FCFA</div>
                        <div class="box"><b>Net à payer</b><span class="net">${Number(payroll.net_salary).toLocaleString('fr-FR')} FCFA</span></div>
                    </div>

                    <div class="words">Montant en lettres : ${numberToFrenchWords(Math.round(payroll.net_salary))} francs CFA</div>
                </body></html>
            `);

            printWindow.document.write(buildPayslipHtml(payroll));
            printWindow.document.close();
            printWindow.focus();
            printWindow.onload = () => printWindow.print();
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

                {/* Résumé */}
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

                {/* Tableau des paies */}
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
                                            {payroll.pay_slip_url && (
                                                <button
                                                    onClick={() => downloadPayslip(payroll.id)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <DownloadIcon className="h-5 w-5" />
                                                </button>
                                            )}
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