import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
//import toast from 'react-hot-toast';

interface RegisterFormData {
    tenant_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

const Register: React.FC = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        const result = await registerUser(data);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                {/* Logo et en-tête */}
                <div className="text-center mb-8">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
                            <span className="text-white font-bold text-3xl">SDS</span>
                        </div>
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                        Créer votre organisation
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Commencez gratuitement avec 6 mois d'essai
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 md:p-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nom de l'organisation */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Nom de l'organisation <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    {...register('tenant_name', {
                                        required: 'Le nom de l\'organisation est requis',
                                        minLength: { value: 2, message: 'Minimum 2 caractères' },
                                    })}
                                    type="text"
                                    placeholder="Ex: Shalom Digital Solutions"
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.tenant_name ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.tenant_name && (
                                    <p className="mt-1.5 text-sm text-danger-500">{errors.tenant_name.message}</p>
                                )}
                            </div>

                            {/* Prénom */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Prénom <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    {...register('first_name', {
                                        required: 'Le prénom est requis',
                                    })}
                                    type="text"
                                    placeholder="Prénom"
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.first_name ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.first_name && (
                                    <p className="mt-1.5 text-sm text-danger-500">{errors.first_name.message}</p>
                                )}
                            </div>

                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Nom <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    {...register('last_name', {
                                        required: 'Le nom est requis',
                                    })}
                                    type="text"
                                    placeholder="Nom"
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.last_name ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.last_name && (
                                    <p className="mt-1.5 text-sm text-danger-500">{errors.last_name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    {...register('email', {
                                        required: 'L\'email est requis',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email invalide',
                                        },
                                    })}
                                    type="email"
                                    placeholder="vous@exemple.com"
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.email ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-danger-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Téléphone */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Téléphone
                                </label>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="+229 01 97 00 00 00"
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                                />
                            </div>

                            {/* Mot de passe */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Mot de passe <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    {...register('password', {
                                        required: 'Le mot de passe est requis',
                                        minLength: { value: 8, message: 'Minimum 8 caractères' },
                                    })}
                                    type="password"
                                    placeholder="Minimum 8 caractères"
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.password ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-danger-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirmer mot de passe */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Confirmer le mot de passe <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    {...register('password_confirmation', {
                                        required: 'Confirmez votre mot de passe',
                                        validate: (value) => value === watch('password') || 'Les mots de passe ne correspondent pas',
                                    })}
                                    type="password"
                                    placeholder="Confirmez votre mot de passe"
                                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.password_confirmation ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-sm text-danger-500">{errors.password_confirmation.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Bouton de soumission */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary-200/50"
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création en cours...
                                </span>
                            ) : (
                                'Créer mon organisation'
                            )}
                        </button>

                        {/* Lien de connexion */}
                        <div className="text-center pt-2">
                            <p className="text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        En créant un compte, vous acceptez nos{' '}
                        <a href="#" className="text-primary-500 hover:text-primary-600 hover:underline">Conditions d'utilisation</a>
                        {' '}et notre{' '}
                        <a href="#" className="text-primary-500 hover:text-primary-600 hover:underline">Politique de confidentialité</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;