import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import PlanDistributionChart from '../../components/admin/Plandistributionchart';
import TenantGrowthChart from '../../components/admin/Tenantgrowthchart';
import { useForm } from 'react-hook-form';
import { admin } from '../../api/admin';
import toast from 'react-hot-toast';
import type { Tenant } from '../../types';
import {
    BuildingOffice2Icon,
    UsersIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    PowerIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface GlobalStats {
    total: number;
    active: number;
    inactive: number;
    total_users: number;
    total_employees: number;
    active_employees: number;
    total_tenants_created_last_30_days: number;
    by_plan: Array<{ plan: string; count: number }>;
    monthly_growth: Array<{ month: string; count: number }>;
}

interface TenantWithCounts extends Tenant {
    users_count?: number;
    employees_count?: number;
}

interface TenantFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    subscription_plan: 'gratuit' | 'starter' | 'standard' | 'business' | 'enterprise';
    admin_first_name: string;
    admin_last_name: string;
    admin_email: string;
    admin_password: string;
}

const PLAN_LABELS: Record<string, string> = {
    gratuit: 'Gratuit',
    starter: 'Starter',
    standard: 'Standard',
    business: 'Business',
    enterprise: 'Enterprise',
};

const AdminDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [tenants, setTenants] = useState<TenantWithCounts[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [savingTenant, setSavingTenant] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TenantFormData>({
        defaultValues: { subscription_plan: 'gratuit' },
    });

    const fetchStats = async (): Promise<void> => {
        try {
            const response = await admin.stats();
            setStats(response.data);
        } catch {
            toast.error('Erreur lors du chargement des statistiques globales');
        }
    };

    const fetchTenants = async (): Promise<void> => {
        try {
            const response = await admin.tenants.list({
                search: search || undefined,
                is_active: statusFilter === '' ? undefined : statusFilter === 'active',
                per_page: 50,
            });
            setTenants(response.data.data);
        } catch {
            toast.error('Erreur lors du chargement des organisations');
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchTenants()]);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchTenants();
        }, 300);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter]);

    const toggleActive = async (tenant: TenantWithCounts): Promise<void> => {
        try {
            if (tenant.is_active) {
                await admin.tenants.deactivate(tenant.id);
                toast.success(`${tenant.name} a été désactivée`);
            } else {
                await admin.tenants.activate(tenant.id);
                toast.success(`${tenant.name} a été activée`);
            }
            fetchTenants();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du changement de statut');
        }
    };

    const deleteTenant = async (tenant: TenantWithCounts): Promise<void> => {
        if (!confirm(`Supprimer définitivement l'organisation "${tenant.name}" ?`)) return;
        try {
            await admin.tenants.delete(tenant.id);
            toast.success('Organisation supprimée avec succès');
            fetchTenants();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Impossible de supprimer cette organisation');
        }
    };

    const exportTenants = async (): Promise<void> => {
        try {
            const response = await admin.tenants.export();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `organisations_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            toast.error("Erreur lors de l'export");
        }
    };

    const onCreateTenant = async (data: TenantFormData): Promise<void> => {
        setSavingTenant(true);
        try {
            await admin.tenants.create(data);
            toast.success('Organisation créée avec succès');
            reset();
            setShowCreateForm(false);
            fetchTenants();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la création de l'organisation");
        } finally {
            setSavingTenant(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-primary-900 via-primary-700 to-primary-600 p-8 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="h-8 w-8" />
                    <span className="uppercase tracking-wide text-xs font-semibold text-primary-200">Super Admin · SDS-RH</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mt-2">Administration de la plateforme</h1>
                <p className="text-primary-100 mt-1">
                    Vue globale sur toutes les organisations, tous clients confondus de SDS-RH.
                </p>
            </div>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Organisations</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total ?? 0}</p>
                            <p className="text-xs text-secondary-600 mt-1">{stats?.active ?? 0} actives</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary-500 bg-opacity-10">
                            <BuildingOffice2Icon className="h-6 w-6 text-primary-500" />
                        </div>
                    </div>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Nouvelles (30 jours)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total_tenants_created_last_30_days ?? 0}</p>
                            <p className="text-xs text-danger-600 mt-1">{stats?.inactive ?? 0} inactives</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary-500 bg-opacity-10">
                            <PlusIcon className="h-6 w-6 text-secondary-500" />
                        </div>
                    </div>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Comptes utilisateurs</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{(stats?.total_users ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500 bg-opacity-10">
                            <UsersIcon className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Employés (toutes orgs.)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{(stats?.total_employees ?? 0).toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">{stats?.active_employees ?? 0} actifs</p>
                        </div>
                        <div className="p-3 rounded-lg bg-warning-500 bg-opacity-10">
                            <UserGroupIcon className="h-6 w-6 text-warning-500" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlanDistributionChart data={stats?.by_plan ?? []} />
                <TenantGrowthChart data={stats?.monthly_growth ?? []} />
            </div>

            {/* Gestion des organisations */}
            <Card title="Organisations clientes" subtitle="Créez, activez, désactivez ou supprimez une organisation">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par nom, email ou téléphone..."
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="active">Actives</option>
                        <option value="inactive">Inactives</option>
                    </select>
                    <button
                        onClick={exportTenants}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        Exporter (CSV)
                    </button>
                    <button
                        onClick={() => setShowCreateForm((v) => !v)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nouvelle organisation
                    </button>
                </div>

                {showCreateForm && (
                    <form onSubmit={handleSubmit(onCreateTenant)} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                        <h4 className="font-semibold text-gray-900">Créer une organisation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom de l'organisation *</label>
                                <input {...register('name', { required: true })} type="text" className="field" />
                                {errors.name && <p className="error">Le nom est requis</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email de l'organisation *</label>
                                <input {...register('email', { required: true })} type="email" className="field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input {...register('phone')} type="tel" className="field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Formule d'abonnement *</label>
                                <select {...register('subscription_plan', { required: true })} className="field">
                                    <option value="gratuit">Gratuit</option>
                                    <option value="starter">Starter</option>
                                    <option value="standard">Standard</option>
                                    <option value="business">Business</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                <input {...register('address')} type="text" className="field" />
                            </div>
                            <div className="md:col-span-2 border-t pt-4">
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Compte administrateur de l'organisation</h5>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                                <input {...register('admin_first_name', { required: true })} type="text" className="field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input {...register('admin_last_name', { required: true })} type="text" className="field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email de connexion *</label>
                                <input {...register('admin_email', { required: true })} type="email" className="field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mot de passe temporaire *</label>
                                <input {...register('admin_password', { required: true, minLength: 8 })} type="text" className="field" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" disabled={savingTenant} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50">
                                {savingTenant ? 'Création...' : "Créer l'organisation"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formule</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateurs</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employés</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tenants.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">Aucune organisation trouvée.</td></tr>
                            )}
                            {tenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                                        <div className="text-xs text-gray-500">{tenant.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-50 text-primary-700">
                                            {PLAN_LABELS[tenant.subscription_plan] || tenant.subscription_plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenant.users_count ?? '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenant.employees_count ?? '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tenant.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {tenant.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => toggleActive(tenant)}
                                                className={tenant.is_active ? 'text-warning-600 hover:text-warning-800' : 'text-secondary-600 hover:text-secondary-800'}
                                                title={tenant.is_active ? 'Désactiver' : 'Activer'}
                                            >
                                                <PowerIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteTenant(tenant)}
                                                className="text-danger-600 hover:text-danger-900"
                                                title="Supprimer"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;