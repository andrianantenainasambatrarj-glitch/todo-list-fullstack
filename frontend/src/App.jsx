import React from 'react';

function App() {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Todo List</h1>
                    <p className="py-6">Gérez vos tâches facilement !</p>
                    <a href="/login" className="btn btn-primary">Se connecter</a>
                    <a href="/register" className="btn btn-secondary ml-4">S’inscrire</a>
                </div>
            </div>
        </div>
    );
}

export default App;