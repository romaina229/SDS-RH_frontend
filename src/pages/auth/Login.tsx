import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: LoginFormData): Promise<void> => {
        setLoading(true);
        const result = await login(data.email, data.password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Panneau de marque */}
            <div className="hidden lg:flex relative flex-col justify-between bg-nocturne-glow text-white p-12">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="font-display font-semibold text-sm">SDS</span>
                    </div>
                    <span className="font-display font-semibold tracking-tight">SDS-RH</span>
                </Link>

                <div className="max-w-sm">
                    <p className="font-display text-3xl font-semibold leading-tight">
                        Chaque organisation dans son propre espace, en toute sécurité.
                    </p>
                    <p className="mt-4 text-primary-100/70 text-sm leading-relaxed">
                        Multi-tenant, multi-devises, conçu pour le contexte africain — une seule
                        plateforme pour piloter les ressources humaines de votre structure.
                    </p>
                </div>

                <p className="text-xs text-primary-200/50 font-mono">SDS-RH v1.5.3</p>
            </div>

            {/* Formulaire */}
            <div className="flex items-center justify-center px-6 py-16 bg-white">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="h-9 w-9 rounded-lg bg-primary-700 flex items-center justify-center">
                            <span className="text-white font-display font-semibold text-sm">SDS</span>
                        </div>
                        <span className="font-display font-semibold tracking-tight text-primary-950">SDS-RH</span>
                    </div>

                    <h1 className="font-display text-2xl font-semibold text-primary-950">Bon retour</h1>
                    <p className="mt-2 text-sm text-primary-700/60">
                        Connectez-vous à l'espace de votre organisation.
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-primary-900">
                                Adresse email
                            </label>
                            <input
                                {...register('email', {
                                    required: "L'email est requis",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Email invalide',
                                    },
                                })}
                                type="email"
                                autoComplete="email"
                                className="field"
                                placeholder="vous@organisation.com"
                            />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-primary-900">
                                    Mot de passe
                                </label>
                                <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-800">
                                    Oublié ?
                                </Link>
                            </div>
                            <input
                                {...register('password', {
                                    required: 'Le mot de passe est requis',
                                    minLength: { value: 6, message: 'Minimum 6 caractères' },
                                })}
                                type="password"
                                autoComplete="current-password"
                                className="field"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="error">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-primary-700/70">
                        Pas encore d'organisation sur SDS-RH ?{' '}
                        <Link to="/register" className="font-semibold text-primary-700 hover:text-primary-900">
                            Créez-en une
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
