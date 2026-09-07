import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/tasks', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                'Identifiants invalides. Vérifiez votre email et votre mot de passe.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="rounded-3xl border border-base-200 bg-base-100 p-8 shadow-xl shadow-primary/5 sm:p-10">
                <header className="mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Bon retour&nbsp;! 
                    </h1>
                    <p className="mt-2 text-sm text-base-content/55">
                        Connectez-vous pour retrouver vos tâches.
                    </p>
                </header>

                {error && (
                    <div role="alert" className="mb-6 flex items-start gap-2.5 rounded-xl border border-error/25 bg-error/8 px-4 py-3 text-sm font-medium text-error animate-pop-in">
                        <AlertCircle size={17} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                            Adresse e-mail
                        </label>
                        <div className="relative">
                            <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@exemple.com"
                                className="input w-full rounded-xl pl-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input w-full rounded-xl pl-10 pr-11 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-base-content/40 transition-colors hover:text-base-content"
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full rounded-xl text-base font-bold shadow-lg shadow-primary/25"
                    >
                        {loading
                            ? <span className="loading loading-spinner loading-sm" />
                            : <LogIn size={19} />}
                        Se connecter
                    </button>
                </form>

                <div className="mt-8 border-t border-base-200 pt-6 text-center text-sm text-base-content/55">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="inline-flex items-center gap-1 font-bold text-primary transition-colors hover:text-secondary">
                        Créer un compte <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-base-content/40">
                Connexion sécurisée — vos données restent privées.
            </p>
        </AuthLayout>
    );
}

export default Login;
