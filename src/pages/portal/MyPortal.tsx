import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { portal } from '../../api/portal';
import toast from 'react-hot-toast';
import {
    UserCircleIcon,
    CalendarIcon,
    FolderIcon,
    DocumentTextIcon,
    BriefcaseIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

interface LeaveBalance {
    annual_entitled: number;
    annual_taken: number;
    annual_remaining: number;
    sick_entitled: number;
    sick_taken: number;
    sick_remaining: number;
}

interface PortalSummary {
    employee: {
        employee_number: string;
        position?: { title: string };
        department?: { name: string };
    };
    contract: {
        type: string;
        base_salary: number;
        currency: string;
    } | null;
    leave_balance: LeaveBalance;
    pending_leaves: number;
    documents_count: number;
    latest_payslip: {
        month: string;
        net_salary: number;
    } | null;
}

const MyPortal: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<PortalSummary | null>(null);
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async (): Promise<void> => {
        try {
            const response = await portal.summary();
            setData(response.data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setNotFound(true);
            } else {
                toast.error(error.response?.data?.message || "Erreur lors du chargement de votre espace");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (notFound || !data) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-500">
                        Aucun dossier employé n'est associé à votre compte.
                    </p>
                </div>
            </Layout>
        );
    }

    const { employee, contract, leave_balance, pending_leaves, documents_count, latest_payslip } = data;

    const links = [
        {
            title: 'Mon profil',
            desc: 'Vos informations personnelles',
            icon: UserCircleIcon,
            href: '/profile',
            color: 'bg-primary-50 text-primary-600',
        },
        {
            title: 'Mes congés',
            desc: `${leave_balance.annual_remaining} jour(s) restant(s)`,
            icon: CalendarIcon,
            href: '/portal/leaves',
            color: 'bg-secondary-50 text-secondary-600',
        },
        {
            title: 'Mes documents',
            desc: `${documents_count} document(s)`,
            icon: FolderIcon,
            href: '/portal/documents',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Mes bulletins',
            desc: 'Historique de paie',
            icon: DocumentTextIcon,
            href: '/portal/payslips',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Mon parcours',
            desc: 'Promotions, mutations, contrats',
            icon: ClockIcon,
            href: '/portal/history',
            color: 'bg-indigo-50 text-indigo-600',
        },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-r from-primary-900 via-primary-700 to-primary-600 p-8 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <UserCircleIcon className="h-8 w-8" />
                        <span className="uppercase tracking-wide text-xs font-semibold text-primary-200">
                            Mon espace
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mt-2">
                        Bonjour, {user?.first_name} 👋
                    </h1>
                    <p className="text-primary-100 mt-1">
                        {employee?.position?.title || 'Poste non renseigné'}
                        {employee?.department?.name ? ` — ${employee.department.name}` : ''}
                        {employee?.employee_number ? ` · ${employee.employee_number}` : ''}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Congés restants</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{leave_balance.annual_remaining}</p>
                                <p className="text-xs text-gray-400 mt-1">sur {leave_balance.annual_entitled} jours/an</p>
                            </div>
                            <CalendarIcon className="h-8 w-8 text-secondary-400" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Demandes en attente</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{pending_leaves}</p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-warning-400" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Documents</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{documents_count}</p>
                            </div>
                            <FolderIcon className="h-8 w-8 text-blue-400" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Contrat</p>
                                <p className="text-lg font-bold text-gray-900 mt-1 uppercase">{contract?.type || '-'}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {contract?.base_salary
                                        ? `${Number(contract.base_salary).toLocaleString()} ${contract.currency}`
                                        : 'Non renseigné'}
                                </p>
                            </div>
                            <BriefcaseIcon className="h-8 w-8 text-primary-400" />
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {links.map((link) => (
                        <Link key={link.href} to={link.href}>
                            <Card className="hover:shadow-md transition-shadow h-full">
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${link.color}`}>
                                        <link.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{link.title}</p>
                                        <p className="text-sm text-gray-500">{link.desc}</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {latest_payslip && (
                    <Card title="Dernier bulletin de paie" subtitle={latest_payslip.month}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Net à payer</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Number(latest_payslip.net_salary).toLocaleString()} FCFA
                                </p>
                            </div>
                            <Link
                                to="/portal/payslips"
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                            >
                                Voir tous mes bulletins
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default MyPortal;