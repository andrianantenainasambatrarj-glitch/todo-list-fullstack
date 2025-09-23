import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

api.interceptors.request.use(config => {
    // Ne pas ajouter Authorization pour les routes d'auth
    const isAuthRoute = config.url?.includes('/login') || config.url?.includes('/register');
    if (!isAuthRoute) {
        const token = localStorage.getItem('token');
        console.log('Token avant en-tête : ', token); // Debug
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('En-tête Authorization ajoutée : Bearer ', token); // Debug
        } else {
            console.log('Aucun token trouvé dans localStorage'); // Debug
        }
    }
    // Définir les bons en-têtes selon la route (API Platform vs Auth)
    if (isAuthRoute) {
        config.headers['Accept'] = 'application/json';
        if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
            config.headers['Content-Type'] = 'application/json';
        }
    } else {
        config.headers['Accept'] = 'application/ld+json';
        if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
            config.headers['Content-Type'] = 'application/ld+json';
        }
    }
    return config;
}, error => {
    console.log('Erreur dans l\'interceptor : ', error); // Debug
    return Promise.reject(error);
});

export default api;