import axios from 'axios';

// URL relative : en dev, le proxy Vite relaie /api vers le backend Symfony
// (voir vite.config.js). En production, servez le front et l'API derrière le
// même domaine (reverse proxy), ou définissez VITE_API_URL au build.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use(config => {
    // Ne pas ajouter Authorization pour les routes d'authentification
    const isAuthRoute = config.url?.includes('/login') || config.url?.includes('/register');
    if (!isAuthRoute) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    // En-têtes adaptés selon la route (API Platform vs Auth)
    if (isAuthRoute) {
        config.headers['Accept'] = 'application/json';
        if (['post', 'put', 'patch'].includes(config.method)) {
            config.headers['Content-Type'] = 'application/json';
        }
    } else {
        config.headers['Accept'] = 'application/ld+json';
        if (config.method === 'patch') {
            // API Platform attend merge-patch pour les mises à jour partielles
            config.headers['Content-Type'] = 'application/merge-patch+json';
        } else if (['post', 'put'].includes(config.method)) {
            config.headers['Content-Type'] = 'application/ld+json';
        }
    }
    return config;
}, error => Promise.reject(error));

// Déconnexion automatique si le token est expiré ou invalide
api.interceptors.response.use(
    response => response,
    error => {
        const isAuthRoute = error.config?.url?.includes('/login') || error.config?.url?.includes('/register');
        if (error.response?.status === 401 && !isAuthRoute) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Extrait la liste d'une collection API Platform / Hydra
// (API Platform 4 renvoie `member`, les versions antérieures `hydra:member`)
export function extractCollection(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.member)) return payload.member;
    if (Array.isArray(payload?.['hydra:member'])) return payload['hydra:member'];
    return [];
}

export default api;
