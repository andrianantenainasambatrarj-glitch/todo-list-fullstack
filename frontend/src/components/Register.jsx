import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
    UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle,
    CheckCircle2, ArrowRight, Check, X,
} from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';

/* Indicateur de robustesse du mot de passe */
function PasswordStrength({ password }) {
    if (!password) return null;

    const rules = [
        { ok: password.length >= 6, label: '6 caractères min.' },
        { ok: /[A-Za-z]/.test(password) && /\d/.test(password), label: 'Lettres et chiffres' },
        { ok: password.length >= 10 || /[^A-Za-z0-9]/.test(password), label: '10+ car. ou symbole' },
    ];
    const score = rules.filter(r => r.ok).length;
    const colors = ['bg-error', 'bg-warning', 'bg-info', 'bg-success'];
    const labels = ['Trop faible', 'Faible', 'Correct', 'Excellent'];

    return (
        <div className="mt-2.5 animate-pop-in">
            <div className="mb-1.5 flex gap-1.5">
                {[0, 1, 2].map(i => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score] : 'bg-base-300'}`} />
                ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-semibold text-base-content/60">{labels[score]}</span>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {rules.map((r, i) => (
                        <span key={i} className={`flex items-center gap-1 text-[11px] ${r.ok ? 'text-success' : 'text-base-content/35'}`}>
                            {r.ok ? <Check size={11} /> : <X size={11} />} {r.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/register', { email, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Erreur d’inscription. Vérifiez vos données.'
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
                        Créez votre compte
                    </h1>
                    <p className="mt-2 text-sm text-base-content/55">
                        30 secondes suffisent. Aucune carte bancaire demandée.
                    </p>
                </header>

                {error && (
                    <div role="alert" className="mb-6 flex items-start gap-2.5 rounded-xl border border-error/25 bg-error/8 px-4 py-3 text-sm font-medium text-error animate-pop-in">
                        <AlertCircle size={17} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div role="status" className="mb-6 flex items-start gap-2.5 rounded-xl border border-success/25 bg-success/8 px-4 py-3 text-sm font-medium text-success animate-pop-in">
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                        <span>Compte créé avec succès ! Redirection vers la connexion…</span>
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
                                placeholder="6 caractères minimum"
                                className="input w-full rounded-xl pl-10 pr-11 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                                autoComplete="new-password"
                                minLength={6}
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
                        <PasswordStrength password={password} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="btn btn-primary w-full rounded-xl text-base font-bold shadow-lg shadow-primary/25"
                    >
                        {loading
                            ? <span className="loading loading-spinner loading-sm" />
                            : <UserPlus size={19} />}
                        Créer mon compte
                    </button>
                </form>

                <div className="mt-8 border-t border-base-200 pt-6 text-center text-sm text-base-content/55">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="inline-flex items-center gap-1 font-bold text-primary transition-colors hover:text-secondary">
                        Se connecter <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-base-content/40">
                En créant un compte, vos tâches restent strictement personnelles.
            </p>
        </AuthLayout>
    );
}

export default Register;
