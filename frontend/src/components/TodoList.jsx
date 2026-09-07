import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { extractCollection } from '../services/api';
import {
    Plus, Trash2, Pencil, LogOut, Search, X, AlertCircle,
    ClipboardList, CheckCircle2, Circle, ListTodo, Loader2,
    CalendarDays, Sparkles, ChevronDown, Save,
} from 'lucide-react';
import Logo from './Logo.jsx';

/* ------------------------------------------------------------------ utils */

/** Décode le payload d'un JWT sans vérification (affichage uniquement). */
function decodeJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return null;
    }
}

function formatDate(iso) {
    if (!iso) return null;
    try {
        return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return null;
    }
}

const FILTERS = [
    { id: 'all', label: 'Toutes' },
    { id: 'active', label: 'À faire' },
    { id: 'done', label: 'Terminées' },
];

/* ------------------------------------------------------- sous-composants */

function StatCard({ icon, label, value, tone }) {
    return (
        <div className="flex items-center gap-3.5 rounded-2xl border border-base-200 bg-base-100 px-5 py-4 shadow-sm">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-2xl font-extrabold leading-none tracking-tight">{value}</p>
                <p className="mt-1 truncate text-xs font-medium text-base-content/50">{label}</p>
            </div>
        </div>
    );
}

function TaskItem({ task, onToggle, onDelete, onSaveEdit, busy }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const save = async () => {
        if (!title.trim()) return;
        await onSaveEdit(task.id, { title: title.trim(), description: description.trim() || null });
        setEditing(false);
    };

    /* ---- mode édition ---- */
    if (editing) {
        return (
            <li className="animate-pop-in rounded-2xl border-2 border-primary/40 bg-base-100 p-4 shadow-lg shadow-primary/5">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
                    className="input input-sm mb-2 w-full rounded-lg font-semibold focus:border-primary focus:outline-none"
                    placeholder="Titre de la tâche"
                    autoFocus
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-sm w-full rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Description (optionnelle)"
                    rows={2}
                />
                <div className="mt-2.5 flex justify-end gap-2">
                    <button onClick={() => setEditing(false)} className="btn btn-ghost btn-sm rounded-lg">
                        Annuler
                    </button>
                    <button onClick={save} disabled={!title.trim() || busy} className="btn btn-primary btn-sm rounded-lg font-semibold">
                        <Save size={15} /> Enregistrer
                    </button>
                </div>
            </li>
        );
    }

    /* ---- mode affichage ---- */
    return (
        <li className={`group animate-fade-up rounded-2xl border bg-base-100 shadow-sm transition-all duration-200 hover:shadow-md ${
            task.completed ? 'border-base-200 opacity-75' : 'border-base-200 hover:border-primary/30'
        }`}>
            <div className="flex items-start gap-3.5 p-4 sm:p-5">
                {/* Case à cocher */}
                <button
                    onClick={() => onToggle(task.id, !task.completed)}
                    disabled={busy}
                    className={`mt-0.5 shrink-0 rounded-full transition-all duration-200 ${
                        task.completed
                            ? 'text-success hover:text-warning'
                            : 'text-base-content/25 hover:scale-110 hover:text-primary'
                    }`}
                    title={task.completed ? 'Remettre à faire' : 'Marquer comme terminée'}
                    aria-label={task.completed ? 'Remettre à faire' : 'Marquer comme terminée'}
                >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                {/* Contenu */}
                <div className="min-w-0 flex-1">
                    <p className={`break-words font-semibold leading-snug ${task.completed ? 'text-base-content/40 line-through' : ''}`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className={`mt-1 break-words text-sm leading-relaxed ${task.completed ? 'text-base-content/30 line-through' : 'text-base-content/55'}`}>
                            {task.description}
                        </p>
                    )}
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-base-content/35">
                        <CalendarDays size={12} /> {formatDate(task.createdAt) || '—'}
                        {task.completed && (
                            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 font-semibold text-success">
                                <Sparkles size={10} /> Terminée
                            </span>
                        )}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    {!confirmDelete ? (
                        <>
                            {!task.completed && (
                                <button
                                    onClick={() => { setTitle(task.title); setDescription(task.description || ''); setEditing(true); }}
                                    className="btn btn-ghost btn-sm btn-square rounded-lg text-base-content/45 hover:text-primary"
                                    title="Modifier" aria-label="Modifier"
                                >
                                    <Pencil size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="btn btn-ghost btn-sm btn-square rounded-lg text-base-content/45 hover:text-error"
                                title="Supprimer" aria-label="Supprimer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    ) : (
                        <div className="flex animate-pop-in items-center gap-1.5">
                            <button
                                onClick={() => { onDelete(task.id); setConfirmDelete(false); }}
                                disabled={busy}
                                className="btn btn-error btn-sm rounded-lg font-semibold text-error-content"
                            >
                                <Trash2 size={14} /> Confirmer
                            </button>
                            <button onClick={() => setConfirmDelete(false)} className="btn btn-ghost btn-sm btn-square rounded-lg" aria-label="Annuler">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}

/* --------------------------------------------------------------- page */

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const userEmail = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? decodeJwt(token)?.username || '' : '';
    }, []);

    const fetchTasks = useCallback(async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(extractCollection(response?.data));
            setError('');
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setError('Impossible de charger les tâches. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        fetchTasks();
    }, [navigate, fetchTasks]);

    /* ---- actions ---- */

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setBusy(true);
        try {
            const res = await api.post('/tasks', {
                title: title.trim(),
                description: description.trim() || null,
            });
            setTasks(prev => [...prev, res.data]);
            setTitle('');
            setDescription('');
            setShowDescription(false);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la création de la tâche.');
        } finally {
            setBusy(false);
        }
    };

    const handleToggle = async (taskId, completed) => {
        setBusy(true);
        try {
            await api.patch(`/tasks/${taskId}`, { completed });
            setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, completed } : t)));
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la mise à jour.');
        } finally {
            setBusy(false);
        }
    };

    const handleSaveEdit = async (taskId, payload) => {
        setBusy(true);
        try {
            const res = await api.patch(`/tasks/${taskId}`, payload);
            setTasks(prev => prev.map(t => (t.id === taskId ? res.data : t)));
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la modification.');
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (taskId) => {
        setBusy(true);
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la suppression.');
        } finally {
            setBusy(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    /* ---- dérivés ---- */

    const doneCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.length - doneCount;
    const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

    const visibleTasks = useMemo(() => {
        let list = tasks;
        if (filter === 'active') list = list.filter(t => !t.completed);
        if (filter === 'done') list = list.filter(t => t.completed);
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(t =>
                t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
            );
        }
        // Les tâches à faire d'abord, puis par date de création décroissante
        return [...list].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }, [tasks, filter, search]);

    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 5) return 'Bonne nuit';
        if (h < 12) return 'Bonjour';
        if (h < 18) return 'Bon après-midi';
        return 'Bonsoir';
    }, []);

    const today = useMemo(() =>
        new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }), []);

    /* ---- rendu ---- */

    return (
        <div className="min-h-screen bg-aurora">
            {/* ------------------------------------------------ HEADER */}
            <header className="sticky top-0 z-40 border-b border-base-200/70 bg-base-100/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2.5">
                        <Logo size={32} />
                        <span className="text-lg font-extrabold tracking-tight">Taskly</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {userEmail && (
                            <div className="hidden items-center gap-2.5 rounded-full border border-base-200 bg-base-100 py-1.5 pl-1.5 pr-4 sm:flex">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold uppercase text-primary-content">
                                    {userEmail.charAt(0)}
                                </span>
                                <span className="max-w-[180px] truncate text-sm font-medium text-base-content/70">
                                    {userEmail}
                                </span>
                            </div>
                        )}
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm rounded-xl font-semibold text-base-content/60 hover:text-error" title="Se déconnecter">
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
                {/* ------------------------------------------------ SALUTATION */}
                <section className="mb-7 animate-fade-up">
                    <p className="text-sm font-medium capitalize text-base-content/45">{today}</p>
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {greeting}{userEmail ? ` 👋` : ' 👋'}
                    </h1>
                    <p className="mt-1.5 text-sm text-base-content/55">
                        {activeCount === 0 && tasks.length > 0
                            ? 'Tout est fait — belle journée ! 🎉'
                            : activeCount > 0
                                ? `Il vous reste ${activeCount} tâche${activeCount > 1 ? 's' : ''} à accomplir.`
                                : 'Commencez par ajouter votre première tâche.'}
                    </p>
                </section>

                {/* ------------------------------------------------ STATISTIQUES */}
                <section className="mb-7 grid animate-fade-up grid-cols-2 gap-3 delay-75 sm:grid-cols-4 sm:gap-4">
                    <StatCard icon={<ListTodo size={20} />} label="Total" value={tasks.length}
                              tone="bg-primary/10 text-primary" />
                    <StatCard icon={<Circle size={20} />} label="À faire" value={activeCount}
                              tone="bg-warning/15 text-warning-content" />
                    <StatCard icon={<CheckCircle2 size={20} />} label="Terminées" value={doneCount}
                              tone="bg-success/10 text-success" />
                    <div className="flex items-center gap-3.5 rounded-2xl border border-base-200 bg-base-100 px-5 py-4 shadow-sm">
                        <div className="radial-progress shrink-0 text-primary text-[10px] font-bold"
                             style={{ '--value': progress, '--size': '2.75rem', '--thickness': '4px' }}
                             role="progressbar" aria-valuenow={progress}>
                            {progress}%
                        </div>
                        <div className="min-w-0">
                            <p className="text-2xl font-extrabold leading-none tracking-tight">{progress}%</p>
                            <p className="mt-1 truncate text-xs font-medium text-base-content/50">Progression</p>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------ ERREUR */}
                {error && (
                    <div role="alert" className="mb-6 flex animate-pop-in items-start justify-between gap-3 rounded-xl border border-error/25 bg-error/8 px-4 py-3 text-sm font-medium text-error">
                        <span className="flex items-start gap-2.5">
                            <AlertCircle size={17} className="mt-0.5 shrink-0" /> {error}
                        </span>
                        <button onClick={() => setError('')} className="shrink-0 rounded p-0.5 hover:bg-error/10" aria-label="Fermer">
                            <X size={15} />
                        </button>
                    </div>
                )}

                {/* ------------------------------------------------ AJOUT */}
                <section className="mb-7 animate-fade-up delay-150">
                    <form onSubmit={handleCreate}
                          className="rounded-2xl border border-base-200 bg-base-100 p-3 shadow-md shadow-primary/5 transition-shadow focus-within:shadow-lg focus-within:shadow-primary/10">
                        <div className="flex items-center gap-2.5">
                            <span className="ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Plus size={19} />
                            </span>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ajouter une tâche… (ex : Appeler le client à 14h)"
                                className="w-full border-none bg-transparent text-[15px] font-medium outline-none placeholder:text-base-content/35"
                                maxLength={255}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowDescription(v => !v)}
                                className={`btn btn-ghost btn-sm shrink-0 rounded-lg text-xs font-semibold ${showDescription ? 'text-primary' : 'text-base-content/45'}`}
                            >
                                Détails <ChevronDown size={14} className={`transition-transform duration-200 ${showDescription ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                                type="submit"
                                disabled={busy || !title.trim()}
                                className="btn btn-primary btn-sm shrink-0 rounded-xl px-4 font-bold shadow-md shadow-primary/25 sm:btn-md"
                            >
                                {busy ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
                                <span className="hidden sm:inline">Ajouter</span>
                            </button>
                        </div>

                        {showDescription && (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optionnelle)"
                                className="textarea mt-3 w-full animate-pop-in rounded-xl text-sm focus:border-primary focus:outline-none"
                                rows={2}
                            />
                        )}
                    </form>
                </section>

                {/* ------------------------------------------------ FILTRES + RECHERCHE */}
                <section className="mb-5 flex animate-fade-up flex-col gap-3 delay-150 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex rounded-xl border border-base-200 bg-base-100 p-1 shadow-sm">
                        {FILTERS.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                                    filter === f.id
                                        ? 'bg-primary text-primary-content shadow-md shadow-primary/25'
                                        : 'text-base-content/50 hover:text-base-content'
                                }`}
                            >
                                {f.label}
                                <span className="ml-1.5 text-xs opacity-70">
                                    {f.id === 'all' ? tasks.length : f.id === 'active' ? activeCount : doneCount}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative sm:w-64">
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher…"
                            className="input input-sm h-10 w-full rounded-xl pl-9 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </section>

                {/* ------------------------------------------------ LISTE */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-base-content/40">
                        <Loader2 size={32} className="animate-spin text-primary" />
                        <p className="text-sm font-medium">Chargement de vos tâches…</p>
                    </div>
                ) : visibleTasks.length === 0 ? (
                    <div className="animate-fade-up rounded-2xl border-2 border-dashed border-base-300 bg-base-100/50 px-6 py-16 text-center">
                        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 text-primary/60">
                            <ClipboardList size={30} />
                        </span>
                        {tasks.length === 0 ? (
                            <>
                                <h3 className="text-lg font-bold">Votre liste est vide</h3>
                                <p className="mx-auto mt-1.5 max-w-sm text-sm text-base-content/50">
                                    Ajoutez votre première tâche ci-dessus et commencez à avancer.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold">Aucun résultat</h3>
                                <p className="mx-auto mt-1.5 max-w-sm text-sm text-base-content/50">
                                    Aucune tâche ne correspond à ce filtre{search ? ' ou à cette recherche' : ''}.
                                </p>
                                <button onClick={() => { setFilter('all'); setSearch(''); }}
                                        className="btn btn-ghost btn-sm mt-4 rounded-lg font-semibold text-primary">
                                    Réinitialiser les filtres
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {visibleTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                busy={busy}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onSaveEdit={handleSaveEdit}
                            />
                        ))}
                    </ul>
                )}

                {/* Encouragement quand tout est terminé */}
                {!loading && tasks.length > 0 && activeCount === 0 && filter !== 'done' && (
                    <div className="mt-6 animate-pop-in rounded-2xl bg-gradient-to-r from-success/10 via-accent/10 to-primary/10 px-6 py-5 text-center">
                        <p className="font-bold">🎉 Bravo, tout est terminé !</p>
                        <p className="mt-1 text-sm text-base-content/55">
                            Profitez de ce moment — ou planifiez la suite.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default TodoList;
