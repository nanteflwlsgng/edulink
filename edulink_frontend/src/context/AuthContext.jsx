import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Initialisation de la session
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("active_session");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Vérification de validité du token
        try {
           // Votre route backend est : GET /api/utilisateurs/me
           await api.get("/utilisateurs/me");
        } catch (error) {
           console.log("Session expirée");
           logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // 2. Login
// 2. Login
const login = async (email, password, type) => {
  try {
    // On convertit le type (student/school) en Rôle API (ETUDIANT/ECOLE)
    const roleAttendu = type === 'student' ? 'ETUDIANT' : 'ECOLE';

    // On envoie le rôle attendu au backend pour vérification
    const response = await api.post("/utilisateurs/login", { 
      email, 
      mot_de_passe: password,
      role: roleAttendu // <--- AJOUT CRUCIAL
    });
    
    const { token, utilisateur } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("active_session", JSON.stringify(utilisateur));
    
    setUser(utilisateur);
    return { success: true, user: utilisateur };
  } catch (error) {
    console.error("Erreur login:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Identifiants incorrects." 
    };
  }
};

  // 3. Register (Le Mapping Crucial)
  const register = async (formData, roleType) => {
    try {
      // Mapping Formulaire React -> API Node/Prisma
      const dataToBackend = {
        prenom: formData.firstName,
        nom: formData.lastName,
        email: formData.email,
        mot_de_passe: formData.password,
        telephone: formData.phone, // Correspond maintenant au champ 'telephone' de Utilisateur
        ville: formData.city,      // Correspond maintenant au champ 'ville' de Utilisateur
        
        // Rôle Prisma
        role: roleType === 'student' ? 'ETUDIANT' : 'ECOLE'
      };

      const response = await api.post("/utilisateurs/register", dataToBackend);
      
      const { token, utilisateur } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("active_session", JSON.stringify(utilisateur));
      
      setUser(utilisateur);
      return { success: true, user: utilisateur };
    } catch (error) {
      console.error("Erreur inscription:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Erreur lors de l'inscription." 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("active_session");
    setUser(null);
    window.location.href = "/"; 
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);