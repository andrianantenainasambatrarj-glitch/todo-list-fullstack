import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { extractCollection } from '../services/api';
import { PlusCircle, Trash2, CheckCircle, Clock, LogOut, ListTodo } from 'lucide-react';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchTasks();
    }, [navigate, fetchTasks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            await fetchTasks();
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la création de la tâche.');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la suppression.');
        }
    };

    const toggleCompleted = async (taskId, completed) => {
        try {
            await api.patch(`/tasks/${taskId}`, { completed });
            setTasks(tasks.map(task => (task.id === taskId ? { ...task, completed } : task)));
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la mise à jour.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const remaining = tasks.filter(t => !t.completed).length;

    return (
        <div className="min-h-screen bg-base-200">
            <div className="navbar bg-base-100 shadow-md">
                <div className="flex-1">
                    <span className="text-xl font-bold flex items-center gap-2 px-2">
                        <ListTodo className="text-primary" /> Todo List
                    </span>
                </div>
                <div className="flex-none">
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                        <LogOut size={16} /> Déconnexion
                    </button>
                </div>
            </div>

            <div className="container mx-auto p-4 max-w-3xl">
                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                        <button className="btn btn-ghost btn-xs" onClick={() => setError('')}>✕</button>
                    </div>
                )}

                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <h2 className="card-title">Nouvelle tâche</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Titre</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Titre de la tâche"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description (optionnelle)"
                                    className="textarea textarea-bordered w-full"
                                />
                            </div>
                            <div className="form-control mt-4">
                                <button type="submit" className="btn btn-primary">
                                    <PlusCircle className="mr-2" size={20} /> Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Mes tâches</h2>
                            <span className="badge badge-primary badge-outline">
                                {remaining} restante{remaining > 1 ? 's' : ''} / {tasks.length}
                            </span>
                        </div>

                        {tasks.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                Aucune tâche pour le moment. Ajoutez-en une ci-dessus !
                            </div>
                        )}

                        <div className="space-y-4">
                            {tasks.map(task => (
                                <div key={task.id} className="card bg-base-100 shadow-md">
                                    <div className="card-body flex-row justify-between items-center flex-wrap gap-2">
                                        <div className="min-w-0">
                                            <h2 className={`card-title break-words ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                {task.title}
                                            </h2>
                                            {task.description && (
                                                <p className={`break-words ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                    {task.description}
                                                </p>
                                            )}
                                            {task.createdAt && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Créée le {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-x-2 shrink-0">
                                            {!task.completed ? (
                                                <button
                                                    onClick={() => toggleCompleted(task.id, true)}
                                                    className="btn btn-success btn-sm"
                                                    title="Marquer comme terminée"
                                                >
                                                    <CheckCircle size={16} /> Terminée
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleCompleted(task.id, false)}
                                                    className="btn btn-warning btn-sm"
                                                    title="Remettre en attente"
                                                >
                                                    <Clock size={16} /> À faire
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="btn btn-error btn-sm"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default TodoList;
