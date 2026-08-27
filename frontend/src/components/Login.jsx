import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ListTodo } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/tasks', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                'Identifiants invalides. Vérifiez votre email et votre mot de passe.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-900 p-4">
            <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white">

                {/* LEFT SIDE - FORM */}
                <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">

                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold font-serif flex items-center justify-center gap-2">
                            <ListTodo className="text-teal-700" /> Todo List
                        </h1>
                        <p className="text-gray-500 text-sm">Organisez vos journées, simplement.</p>
                    </div>

                    {/* Switch Buttons */}
                    <div className="flex mb-6 space-x-2 justify-center">
                        <Link to="/register" className="px-6 py-2 border rounded-lg text-sm hover:bg-gray-100 transition">
                            S’inscrire
                        </Link>
                        <button className="px-6 py-2 border rounded-lg bg-black text-white text-sm">
                            Se connecter
                        </button>
                    </div>

                    {/* Heading */}
                    <h2 className="text-xl font-semibold mb-4">Bon retour parmi nous !</h2>

                    {error && (
                        <div className="alert alert-error mb-4 text-sm">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="input input-bordered w-full rounded-lg"
                                autoComplete="email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                className="input input-bordered w-full rounded-lg pr-10"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn bg-black text-white w-full rounded-lg hover:bg-gray-800 transition"
                        >
                            {loading
                                ? <span className="loading loading-spinner loading-sm" />
                                : <LogIn className="mr-2" size={20} />}
                            Se connecter
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center mt-4">
                        <Link to="/register" className="link link-hover text-blue-600">
                            Pas de compte ? S’inscrire
                        </Link>
                    </div>
                </div>

                {/* RIGHT SIDE - IMAGE */}
                <div className="relative hidden lg:block lg:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                        alt="Paysage inspirant"
                        className="h-full w-full object-cover"
                    />

                    {/* Overlay Top */}
                    <div className="absolute top-6 right-6 bg-white/90 p-4 rounded-xl shadow max-w-xs">
                        <h3 className="font-semibold text-gray-800">Planifiez. Réalisez. Avancez.</h3>
                        <p className="text-sm text-gray-600">
                            Gardez le cap sur vos objectifs, une tâche à la fois.
                        </p>
                    </div>

                    {/* Overlay Bottom */}
                    <div className="absolute bottom-10 left-6 text-white max-w-sm">
                        <h2 className="text-2xl font-bold">Chaque jour compte. Faites-le compter !</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
