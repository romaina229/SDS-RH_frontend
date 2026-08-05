import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
    const [loading, setLoading] = useState<boolean>(false);

    if (!token || !email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Lien invalide</h2>
                    <p className="mt-2 text-gray-600">Ce lien de réinitialisation est invalide ou a expiré.</p>
                    <Link to="/forgot-password" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
                        Demander un nouveau lien
                    </Link>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
        setLoading(true);
        try {
            await axios.post('/reset-password', {
                ...data,
                token,
                email,
            });
            toast.success('Mot de passe réinitialisé avec succès');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <div className="h-14 w-14 bg-primary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">SDS</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Nouveau mot de passe
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <input
                                {...register('password', {
                                    required: 'Le mot de passe est requis',
                                    minLength: {
                                        value: 8,
                                        message: 'Minimum 8 caractères',
                                    },
                                })}
                                type="password"
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Minimum 8 caractères"
                            />
                            {errors.password && (
                                <p className="text-danger-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirmer le mot de passe
                            </label>
                            <input
                                {...register('password_confirmation', {
                                    required: 'Confirmez votre mot de passe',
                                    validate: (value) => value === watch('password') || 'Les mots de passe ne correspondent pas',
                                })}
                                type="password"
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Confirmez votre mot de passe"
                            />
                            {errors.password_confirmation && (
                                <p className="text-danger-500 text-xs mt-1">{errors.password_confirmation.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Réinitialisation...
                                </span>
                            ) : (
                                'Réinitialiser le mot de passe'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;