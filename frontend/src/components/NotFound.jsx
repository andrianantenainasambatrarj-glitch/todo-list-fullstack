import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-aurora px-4 text-center">
            <Logo size={52} />
            <div>
                <h1 className="text-6xl font-extrabold text-gradient">404</h1>
                <p className="mt-3 text-base-content/60">Cette page n’existe pas ou a été déplacée.</p>
            </div>
            <Link to="/" className="btn btn-primary rounded-xl font-bold shadow-lg shadow-primary/25">
                Retour à l’accueil
            </Link>
        </div>
    );
}

export default NotFound;
