import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const Settings: React.FC = () => {
    const { tenant } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [settings, setSettings] = useState({
        language: 'fr',
        currency: 'XOF',
        timezone: 'Africa/Porto-Novo',
        country: 'BJ',
        company_name: tenant?.name || '',
        company_email: tenant?.email || '',
        company_phone: tenant?.phone || '',
        company_address: tenant?.address || '',
    });

    useEffect(() => {
        if (tenant?.settings) {
            setSettings({
                ...settings,
                ...tenant.settings,
                company_name: tenant.name,
                company_email: tenant.email,
                company_phone: tenant.phone || '',
                company_address: tenant.address || '',
            });
        }
    }, [tenant]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('/settings', {
                name: settings.company_name,
                email: settings.company_email,
                phone: settings.company_phone,
                address: settings.company_address,
                settings: {
                    language: settings.language,
                    currency: settings.currency,
                    timezone: settings.timezone,
                    country: settings.country,
                },
            });
            toast.success('Paramètres mis à jour avec succès');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                    <p className="text-gray-500 mt-1">Configuration de l'organisation</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations de l'organisation */}
                    <Card>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom de l'organisation</label>
                                <input
                                    type="text"
                                    value={settings.company_name}
                                    onChange={(e) => setSettings({...settings, company_name: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={settings.company_email}
                                    onChange={(e) => setSettings({...settings, company_email: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    type="tel"
                                    value={settings.company_phone}
                                    onChange={(e) => setSettings({...settings, company_phone: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                <textarea
                                    value={settings.company_address}
                                    onChange={(e) => setSettings({...settings, company_address: e.target.value})}
                                    rows={2}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </Card>

                    {/* Paramètres régionaux */}
                    <Card>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres régionaux</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Langue</label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Devise</label>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="XOF">FCFA (XOF)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                    <option value="USD">Dollar (USD)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
                                <select
                                    value={settings.timezone}
                                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="Africa/Porto-Novo">Africa/Porto-Novo</option>
                                    <option value="Africa/Abidjan">Africa/Abidjan</option>
                                    <option value="Africa/Dakar">Africa/Dakar</option>
                                    <option value="Africa/Lagos">Africa/Lagos</option>
                                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pays</label>
                                <select
                                    value={settings.country}
                                    onChange={(e) => setSettings({...settings, country: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="BJ">Bénin</option>
                                    <option value="CI">Côte d'Ivoire</option>
                                    <option value="SN">Sénégal</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="KE">Kenya</option>
                                </select>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                                {loading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Abonnement */}
                <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Abonnement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Plan actuel</p>
                            <p className="text-xl font-bold text-gray-900 capitalize">
                                {tenant?.subscription_plan || 'Gratuit'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Statut</p>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tenant?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {tenant?.is_active ? 'Actif' : 'Inactif'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Expire le</p>
                            <p className="text-xl font-bold text-gray-900">
                                {tenant?.subscription_expires_at 
                                    ? new Date(tenant.subscription_expires_at).toLocaleDateString('fr-FR')
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Settings;