import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Quote } from 'lucide-react';
import Logo from './Logo.jsx';

/**
 * Gabarit commun aux pages Connexion / Inscription :
 * panneau de marque à gauche, formulaire à droite.
 */
function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-aurora">
            {/* ---------------- Panneau de marque (desktop) ---------------- */}
            <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-brand-panel p-10 text-white lg:flex xl:p-14">
                <Link to="/" className="relative z-10 flex w-fit items-center gap-2.5">
                    <Logo size={38} className="!shadow-black/20" />
                    <span className="text-2xl font-extrabold tracking-tight">Taskly</span>
                </Link>

                <div className="relative z-10">
                    <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
                        La clarté d’esprit commence par une liste bien tenue.
                    </h2>

                    <ul className="mt-8 space-y-3.5 text-white/85">
                        <li className="flex items-center gap-3">
                            <CheckCircle2 size={19} className="shrink-0 text-emerald-300" />
                            Vos tâches accessibles à tout moment
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 size={19} className="shrink-0 text-emerald-300" />
                            Progression visible, motivation durable
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 size={19} className="shrink-0 text-emerald-300" />
                            Compte privé et sécurisé (JWT)
                        </li>
                    </ul>
                </div>

                <figure className="glass relative z-10 rounded-2xl p-5">
                    <Quote size={18} className="mb-2 text-white/50" />
                    <blockquote className="text-sm leading-relaxed text-white/85">
                        « Depuis que j’utilise Taskly, je termine mes journées l’esprit léger.
                        Tout est noté, rien n’est oublié. »
                    </blockquote>
                    <figcaption className="mt-3 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">SM</span>
                        <div className="text-xs">
                            <p className="font-semibold text-white">Sarah M.</p>
                            <p className="text-white/60">Cheffe de projet</p>
                        </div>
                    </figcaption>
                </figure>
            </aside>

            {/* ---------------- Zone formulaire ---------------- */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
                {/* Logo mobile */}
                <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
                    <Logo size={34} />
                    <span className="text-xl font-extrabold tracking-tight">Taskly</span>
                </Link>

                <div className="w-full max-w-md animate-fade-up">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;
