import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { useForm } from 'react-hook-form';

interface ProfileFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

interface PasswordFormData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

const Profile: React.FC = () => {
    const { user, tenant } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        },
    });

    const passwordForm = useForm<PasswordFormData>();

    const onSubmitProfile = async (data: ProfileFormData): Promise<void> => {
        setLoading(true);
        try {
            await axios.put('/profile', data);
            toast.success('Profil mis à jour avec succès');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const onSubmitPassword = async (data: PasswordFormData): Promise<void> => {
        if (data.new_password !== data.new_password_confirmation) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setPasswordLoading(true);
        try {
            await axios.post('/change-password', {
                current_password: data.current_password,
                new_password: data.new_password,
            });
            toast.success('Mot de passe modifié avec succès');
            passwordForm.reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
                    <p className="text-gray-500 mt-1">Gestion de vos informations personnelles</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations personnelles */}
                    <Card>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                                <input
                                    {...register('first_name', { required: 'Le prénom est requis' })}
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {errors.first_name && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input
                                    {...register('last_name', { required: 'Le nom est requis' })}
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {errors.last_name && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    {...register('email', {
                                        required: 'L\'email est requis',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email invalide',
                                        },
                                    })}
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {errors.email && (
                                    <p className="text-danger-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                                {loading ? 'Enregistrement...' : 'Mettre à jour le profil'}
                            </button>
                        </form>
                    </Card>

                    {/* Changement de mot de passe */}
                    <Card>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                        <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mot de passe actuel *</label>
                                <input
                                    {...passwordForm.register('current_password', {
                                        required: 'Le mot de passe actuel est requis',
                                    })}
                                    type="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {passwordForm.formState.errors.current_password && (
                                    <p className="text-danger-500 text-xs mt-1">
                                        {passwordForm.formState.errors.current_password.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe *</label>
                                <input
                                    {...passwordForm.register('new_password', {
                                        required: 'Le nouveau mot de passe est requis',
                                        minLength: {
                                            value: 8,
                                            message: 'Minimum 8 caractères',
                                        },
                                    })}
                                    type="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {passwordForm.formState.errors.new_password && (
                                    <p className="text-danger-500 text-xs mt-1">
                                        {passwordForm.formState.errors.new_password.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
                                <input
                                    {...passwordForm.register('new_password_confirmation', {
                                        required: 'Confirmez le mot de passe',
                                        validate: (value) => 
                                            value === passwordForm.watch('new_password') || 
                                            'Les mots de passe ne correspondent pas',
                                    })}
                                    type="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {passwordForm.formState.errors.new_password_confirmation && (
                                    <p className="text-danger-500 text-xs mt-1">
                                        {passwordForm.formState.errors.new_password_confirmation.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                                {passwordLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
                            </button>
                        </form>
                    </Card>
                </div>

                {/* Informations de l'organisation */}
                <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Organisation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Nom</p>
                            <p className="font-medium text-gray-900">{tenant?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{tenant?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Téléphone</p>
                            <p className="font-medium text-gray-900">{tenant?.phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Plan</p>
                            <p className="font-medium text-gray-900 capitalize">{tenant?.subscription_plan || 'Gratuit'}</p>
                        </div>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Profile;