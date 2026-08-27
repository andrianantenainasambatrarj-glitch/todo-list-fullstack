import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/register", { email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Erreur d’inscription. Vérifiez vos données."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200">
      <div className="hero-content flex-col lg:flex-row-reverse gap-16">
        {/* IMAGE D'ILLUSTRATION */}
        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Inspiration"
            className="rounded-2xl shadow-lg w-[450px]"
          />
        </div>

        {/* FORMULAIRE */}
        <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Créez votre compte
          </h1>

          {error && (
            <div className="alert alert-error mb-4 text-sm">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4 text-sm">
              <span>✅ Inscription réussie ! Redirection vers la connexion…</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label font-medium">Email</label>
              <div className="input input-bordered flex items-center gap-2">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="grow outline-none bg-transparent"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-control">
              <label className="label font-medium">Mot de passe</label>
              <div className="input input-bordered flex items-center gap-2">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (6 caractères minimum)"
                  className="grow outline-none bg-transparent"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Bouton */}
            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading || success}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <UserPlus className="mr-2" size={20} />
                )}
                S’inscrire
              </button>
            </div>
          </form>

          {/* Lien vers login */}
          <p className="text-center mt-6 text-sm">
            Déjà un compte ?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
