import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
    ArrowRight, CheckCircle2, ShieldCheck, Zap, ListChecks,
    Circle, Sparkles, LayoutDashboard, LockKeyhole,
} from 'lucide-react';
import Logo from './components/Logo.jsx';

/* Aperçu factice de l'application (côté droit du hero) */
function AppPreview() {
    const demo = [
        { title: 'Préparer la présentation client', done: true },
        { title: 'Répondre aux e-mails importants', done: true },
        { title: 'Faire 30 min de sport', done: false },
        { title: 'Réserver le restaurant de samedi', done: false },
    ];
    const doneCount = demo.filter(t => t.done).length;

    return (
        <div className="relative animate-float">
            {/* Halo derrière la carte */}
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 blur-2xl" aria-hidden="true" />

            <div className="relative w-[340px] sm:w-[400px] rounded-[1.5rem] border border-base-300 bg-base-100 shadow-2xl overflow-hidden">
                {/* Barre de fenêtre */}
                <div className="flex items-center gap-1.5 border-b border-base-200 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                    <span className="ml-3 text-xs font-medium text-base-content/40">taskly — mes tâches</span>
                </div>

                <div className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">Aujourd’hui</p>
                            <p className="text-xs text-base-content/50">{doneCount} sur {demo.length} terminées</p>
                        </div>
                        <div className="radial-progress text-primary text-xs font-bold"
                             style={{ '--value': (doneCount / demo.length) * 100, '--size': '2.9rem', '--thickness': '4px' }}
                             role="progressbar">
                            {Math.round((doneCount / demo.length) * 100)}%
                        </div>
                    </div>

                    <ul className="space-y-2.5">
                        {demo.map((t, i) => (
                            <li key={i}
                                className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
                                    t.done
                                        ? 'border-success/20 bg-success/5 text-base-content/45'
                                        : 'border-base-200 bg-base-100'
                                }`}>
                                {t.done
                                    ? <CheckCircle2 size={18} className="shrink-0 text-success" />
                                    : <Circle size={18} className="shrink-0 text-base-content/25" />}
                                <span className={t.done ? 'line-through' : 'font-medium'}>{t.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Badge flottant */}
            <div className="absolute -right-4 -top-4 animate-pop-in rounded-2xl border border-base-200 bg-base-100 px-4 py-2.5 shadow-xl delay-300">
                <p className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles size={16} className="text-secondary" /> +1 tâche terminée !
                </p>
            </div>
        </div>
    );
}

function App() {
    // Déjà connecté ? Direction les tâches.
    if (localStorage.getItem('token')) {
        return <Navigate to="/tasks" replace />;
    }

    const features = [
        {
            icon: <Zap size={22} />,
            color: 'bg-primary/10 text-primary',
            title: 'Rapide et simple',
            text: 'Ajoutez une tâche en deux secondes. Aucune configuration, aucune courbe d’apprentissage : vous écrivez, c’est noté.',
        },
        {
            icon: <LayoutDashboard size={22} />,
            color: 'bg-secondary/10 text-secondary',
            title: 'Vue claire de vos journées',
            text: 'Progression, tâches restantes, filtres : tout est visible d’un coup d’œil pour garder le cap sans effort.',
        },
        {
            icon: <ShieldCheck size={22} />,
            color: 'bg-accent/20 text-accent-content',
            title: 'Vos données protégées',
            text: 'Compte personnel sécurisé par jeton JWT. Vos tâches ne sont visibles que par vous, point final.',
        },
    ];

    const steps = [
        { n: '1', title: 'Créez votre compte', text: 'Un e-mail, un mot de passe — c’est tout ce qu’il faut pour commencer.' },
        { n: '2', title: 'Notez vos tâches', text: 'Titre, description si besoin, et la tâche rejoint votre liste instantanément.' },
        { n: '3', title: 'Avancez sereinement', text: 'Cochez ce qui est fait, suivez votre progression et videz-vous la tête.' },
    ];

    return (
        <div className="min-h-screen bg-aurora text-base-content">
            {/* ------------------------------------------------ NAVBAR */}
            <header className="sticky top-0 z-50 border-b border-base-200/70 bg-base-100/80 backdrop-blur-md">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link to="/" className="flex items-center gap-2.5">
                        <Logo size={34} />
                        <span className="text-xl font-extrabold tracking-tight">Taskly</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md font-semibold">
                            Se connecter
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-sm sm:btn-md font-semibold shadow-lg shadow-primary/25">
                            Commencer <ArrowRight size={16} />
                        </Link>
                    </div>
                </nav>
            </header>

            {/* ------------------------------------------------ HERO */}
            <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
                <div className="animate-fade-up">
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
                        <Sparkles size={15} /> Gratuit, simple, efficace
                    </span>

                    <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                        Videz-vous la tête,<br />
                        <span className="text-gradient">pas votre énergie.</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-base-content/65">
                        Taskly capture tout ce que vous avez à faire pour que vous puissiez
                        vous concentrer sur l’essentiel&nbsp;: <strong>le faire</strong>.
                        Une liste claire, une progression visible, zéro distraction.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link to="/register" className="btn btn-primary btn-lg font-bold shadow-xl shadow-primary/25">
                            Créer mon compte gratuit <ArrowRight size={19} />
                        </Link>
                        <Link to="/login" className="btn btn-ghost btn-lg font-semibold">
                            J’ai déjà un compte
                        </Link>
                    </div>

                    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/55">
                        <li className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-success" /> Sans carte bancaire</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-success" /> Prêt en 30 secondes</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-success" /> Données privées</li>
                    </ul>
                </div>

                <div className="flex justify-center lg:justify-end">
                    <AppPreview />
                </div>
            </section>

            {/* ------------------------------------------------ FEATURES */}
            <section className="border-y border-base-200/70 bg-base-100/60 py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Tout ce qu’il faut. <span className="text-gradient">Rien de superflu.</span>
                        </h2>
                        <p className="mt-4 text-base-content/60">
                            Les meilleurs outils sont ceux qu’on oublie : Taskly reste discret
                            et vous laisse avancer.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {features.map((f, i) => (
                            <article key={i} className="group rounded-2xl border border-base-200 bg-base-100 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                                    {f.icon}
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-base-content/60">{f.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------ COMMENT ÇA MARCHE */}
            <section className="py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Lancé en 3 étapes</h2>
                        <p className="mt-4 text-base-content/60">Pas de tutoriel nécessaire — promis.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {steps.map((s, i) => (
                            <div key={i} className="relative rounded-2xl border border-base-200 bg-base-100 p-7">
                                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-extrabold text-primary-content shadow-lg shadow-primary/25">
                                    {s.n}
                                </span>
                                <h3 className="mb-2 font-bold">{s.title}</h3>
                                <p className="text-sm leading-relaxed text-base-content/60">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------ CTA FINAL */}
            <section className="px-4 pb-20 sm:px-6">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand-panel px-6 py-16 text-center text-white sm:px-12">
                    <div className="relative z-10 mx-auto max-w-2xl">
                        <ListChecks size={44} className="mx-auto mb-5 opacity-90" />
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Votre prochaine journée productive commence ici.
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-white/75">
                            Rejoignez Taskly et transformez le chaos du quotidien en une liste
                            claire et motivante.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link to="/register" className="btn btn-lg border-none bg-white font-bold text-primary hover:bg-white/90">
                                Créer mon compte <ArrowRight size={19} />
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg border-white/40 font-semibold text-white hover:border-white hover:bg-white/10">
                                Se connecter
                            </Link>
                        </div>
                        <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-white/60">
                            <LockKeyhole size={14} /> Authentification sécurisée par JWT
                        </p>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------ FOOTER */}
            <footer className="border-t border-base-200/70 bg-base-100/60">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-base-content/50 sm:flex-row sm:px-6">
                    <div className="flex items-center gap-2">
                        <Logo size={26} />
                        <span className="font-bold text-base-content/70">Taskly</span>
                        <span>— © {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="transition-colors hover:text-primary">Connexion</Link>
                        <Link to="/register" className="transition-colors hover:text-primary">Inscription</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
