import React from 'react';
import { Check } from 'lucide-react';

/**
 * Pastille de marque « Taskly » réutilisée sur toutes les pages.
 * size : taille de la pastille en px.
 */
function Logo({ size = 36, className = '' }) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg shadow-primary/30 ${className}`}
            style={{ width: size, height: size }}
        >
            <Check size={size * 0.58} strokeWidth={3.5} />
        </span>
    );
}

export default Logo;
