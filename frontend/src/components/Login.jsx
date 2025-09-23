import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Apple, Github, LogIn } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/login', { email, password });
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        console.log('Nouveau token stocké : ', newToken); // Vérifie le nouveau token
        navigate('/tasks', { replace: true });
        window.location.reload(); // Recharge pour appliquer le nouveau token
    } catch (error) {
        alert('Erreur de connexion : ' + (error.response?.data?.detail || 'Vérifiez vos identifiants'));
    }
};
    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-900">
            <div className="flex w-[90%] max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white">
                
                {/* LEFT SIDE - FORM */}
                <div className="w-1/2 p-10 flex flex-col justify-center">
                    
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold font-serif">Travel Voyanix</h1>
                        <p className="text-gray-500 text-sm">Explore More. Experience Life.</p>
                    </div>

                    {/* Switch Buttons */}
                    <div className="flex mb-6 space-x-2 justify-center">
                        <button className="px-6 py-2 border rounded-lg text-sm hover:bg-gray-100 transition">
                            Sign Up
                        </button>
                        <button className="px-6 py-2 border rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition">
                            Log In
                        </button>
                    </div>

                    {/* Heading */}
                    <h2 className="text-xl font-semibold mb-4">Journey Begins</h2>

                    {/* Social Logins */}
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <button className="btn btn-outline btn-sm px-4 rounded-lg">
                            <Apple className="w-5 h-5" />
                        </button>
                  
                        <button className="btn btn-outline btn-sm px-4 rounded-lg">
                            <Github className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <hr className="flex-1 border-gray-300" />
                        <span className="mx-2 text-gray-500 text-sm">or</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>

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
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                className="input input-bordered w-full rounded-lg pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Remember me + Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="checkbox checkbox-xs" />
                                Remember me
                            </label>
                            <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                        </div>

                        {/* Login Button */}
                        <button type="submit" className="btn bg-black text-white w-full rounded-lg hover:bg-gray-800 transition">
                            <LogIn className="mr-2" size={20} /> Se connecter
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center mt-4">
                        <a href="/register" className="link link-hover text-blue-600">
                            Pas de compte ? S’inscrire
                        </a>
                    </div>
                </div>

                {/* RIGHT SIDE - IMAGE */}
                <div className="relative w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                        alt="Travel background"
                        className="h-full w-full object-cover"
                    />
                    
                    {/* Overlay Top */}
                    <div className="absolute top-6 right-6 bg-white/90 p-4 rounded-xl shadow max-w-xs">
                        <h3 className="font-semibold text-gray-800">Wander, Explore, Experience.</h3>
                        <p className="text-sm text-gray-600">
                            Discover new places, embrace adventures & create unforgettable travel memories worldwide.
                        </p>
                    </div>

                    {/* Overlay Bottom */}
                    <div className="absolute bottom-10 left-6 text-white max-w-sm">
                        <h2 className="text-2xl font-bold">Escape the Ordinary, Embrace the Journey!</h2>
                        <button className="btn btn-sm mt-3 bg-white text-gray-800 border-none rounded-lg hover:bg-gray-100">
                            Experience the world your way
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
