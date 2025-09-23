import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Trash2, CheckCircle, Clock } from 'lucide-react';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchTasks = async () => {
            try {
                const response = await api.get('/tasks');
                const payload = response?.data;
                const list = Array.isArray(payload?.['hydra:member'])
                    ? payload['hydra:member']
                    : (Array.isArray(payload) ? payload : []);
                setTasks(list);
            } catch (error) {
                const status = error.response?.status;
                if (status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                alert('Erreur : ' + (error.response?.data?.detail || 'Vérifiez votre connexion'));
            }
        };
        fetchTasks();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté.');
            navigate('/login');
            return;
        }
        try {
            await api.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            const response = await api.get('/tasks');
            const payload = response?.data;
            const list = Array.isArray(payload?.['hydra:member'])
                ? payload['hydra:member']
                : (Array.isArray(payload) ? payload : []);
            setTasks(list);
        } catch (error) {
            alert('Erreur : ' + (error.response?.data?.detail || 'Vérifiez vos données'));
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            alert('Erreur lors de la suppression : ' + (error.response?.data?.detail || 'Vérifiez votre connexion'));
        }
    };

    const handleSuccess = async (taskId) => {
        try {
            const taskToUpdate = tasks.find(task => task.id === taskId);
            await api.put(`/tasks/${taskId}`, { ...taskToUpdate, completed: true });
            const response = await api.get('/tasks');
            const payload = response?.data;
            const list = Array.isArray(payload?.['hydra:member'])
                ? payload['hydra:member']
                : (Array.isArray(payload) ? payload : []);
            setTasks(list);
        } catch (error) {
            alert('Erreur lors de la mise à jour : ' + (error.response?.data?.detail || 'Vérifiez votre connexion'));
        }
    };

    const handlePending = async (taskId) => {
        try {
            const taskToUpdate = tasks.find(task => task.id === taskId);
            await api.put(`/tasks/${taskId}`, { ...taskToUpdate, completed: false });
            const response = await api.get('/tasks');
            const payload = response?.data;
            const list = Array.isArray(payload?.['hydra:member'])
                ? payload['hydra:member']
                : (Array.isArray(payload) ? payload : []);
            setTasks(list);
        } catch (error) {
            alert('Erreur lors de la mise à jour : ' + (error.response?.data?.detail || 'Vérifiez votre connexion'));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Mes Tâches</h1>
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
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
                                placeholder="Description"
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
            <div className="space-y-4">
                {(tasks || []).map(task => (
                    <div key={task.id} className="card bg-base-100 shadow-md">
                        <div className="card-body flex-row justify-between items-center">
                            <div>
                                <h2 className={`card-title ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </h2>
                                <p className={task.completed ? 'line-through text-gray-500' : ''}>
                                    {task.description}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleSuccess(task.id)}
                                    className="btn btn-success btn-sm"
                                    disabled={task.completed}
                                >
                                    <CheckCircle size={16} /> Succès
                                </button>
                                <button
                                    onClick={() => handlePending(task.id)}
                                    className="btn btn-warning btn-sm"
                                    disabled={!task.completed}
                                >
                                    <Clock size={16} /> Pas encore
                                </button>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="btn btn-error btn-sm"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TodoList;