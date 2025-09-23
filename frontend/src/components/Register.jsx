import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { email, password });
      alert("✅ Inscription réussie ! Connectez-vous.");
      navigate("/login");
    } catch (error) {
      alert(
        "❌ Erreur d’inscription : " +
          (error.response?.data?.detail || "Vérifiez vos données")
      );
    }
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200">
      <div className="hero-content flex-col lg:flex-row-reverse gap-16">
        {/* IMAGE D'ILLUSTRATION */}
        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Travel"
            className="rounded-2xl shadow-lg w-[450px]"
          />
        </div>

        {/* FORMULAIRE */}
        <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Créez votre compte
          </h1>

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
                  placeholder="••••••••"
                  className="grow outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Bouton */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                <UserPlus className="mr-2" size={20} /> S’inscrire
              </button>
            </div>
          </form>

          {/* Lien vers login */}
          <p className="text-center mt-6 text-sm">
            Déjà un compte ?{" "}
            <a href="/login" className="link link-primary font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
