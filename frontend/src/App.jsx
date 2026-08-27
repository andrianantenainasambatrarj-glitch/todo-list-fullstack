import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ListTodo } from 'lucide-react';

function App() {
    // Déjà connecté ? Direction les tâches.
    if (localStorage.getItem('token')) {
        return <Navigate to="/tasks" replace />;
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <ListTodo size={64} className="mx-auto mb-4 text-primary" />
                    <h1 className="text-5xl font-bold">Todo List</h1>
                    <p className="py-6">Gérez vos tâches facilement !</p>
                    <Link to="/login" className="btn btn-primary">Se connecter</Link>
                    <Link to="/register" className="btn btn-secondary ml-4">S’inscrire</Link>
                </div>
            </div>
        </div>
    );
}

export default App;
