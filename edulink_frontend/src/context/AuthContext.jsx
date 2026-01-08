import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // Assure-toi que ce fichier existe bien dans src/services/api.js

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Au chargement de l'application, on vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("active_session");

      if (token && storedUser) {
        // On remet l'utilisateur en mémoire depuis le localStorage pour aller vite
        setUser(JSON.parse(storedUser));
        
        // Optionnel : On peut vérifier si le token est toujours valide côté serveur
        try {
           await api.get("/utilisateurs/me");
        } catch (error) {
           // Si le token n'est plus valide, on déconnecte
           console.log("Session expirée, déconnexion...");
           logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 2. Fonction de Connexion
  const login = async (email, mot_de_passe) => {
    try {
      // Attention: vérifie si ton backend attend "password" ou "motDePasse"
      // Si ton backend attend "motDePasse", change la ligne ci-dessous :
      const response = await api.post("/utilisateurs/login", { email,  mot_de_passe });
      
      // On suppose que le backend renvoie { token: "...", utilisateur: {...} }
      // Si ton backend renvoie "user" au lieu de "utilisateur", change le nom ici
      const { token, utilisateur } = response.data;

      // Sauvegarde
      localStorage.setItem("token", token);
      localStorage.setItem("active_session", JSON.stringify(utilisateur));
      
      setUser(utilisateur);
      return { success: true };
    } catch (error) {
      console.error("Erreur login:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Email ou mot de passe incorrect." 
      };
    }
  };

  // 3. Fonction d'Inscription
  const register = async (userData) => {
    try {
      // CORRECTION ICI : La route est /register selon ton fichier de routes
      const response = await api.post("/utilisateurs/register", userData);
      
      const { token, utilisateur } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("active_session", JSON.stringify(utilisateur));
      
      setUser(utilisateur);
      return { success: true };
    } catch (error) {
      console.error("Erreur inscription:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Erreur lors de l'inscription." 
      };
    }
  };

  // 4. Fonction de Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("active_session");
    setUser(null);
    // On redirige vers la page d'accueil ou de login
    window.location.href = "/"; 
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);