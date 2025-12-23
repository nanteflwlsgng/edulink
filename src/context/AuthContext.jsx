import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté au chargement
    const storedUser = localStorage.getItem("active_session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulation de vérification backend
    const storedAccounts = JSON.parse(localStorage.getItem("student_accounts") || "[]");
    const foundUser = storedAccounts.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const sessionUser = { ...foundUser, password: "" }; // On ne garde pas le mdp en session
      localStorage.setItem("active_session", JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    }
    return { success: false, message: "Email ou mot de passe incorrect." };
  };

  const register = (userData) => {
    const storedAccounts = JSON.parse(localStorage.getItem("student_accounts") || "[]");
    
    if (storedAccounts.find(u => u.email === userData.email)) {
      return { success: false, message: "Cet email existe déjà." };
    }

    const newUser = { id: Date.now(), ...userData, role: "student" };
    storedAccounts.push(newUser);
    localStorage.setItem("student_accounts", JSON.stringify(storedAccounts));
    
    // Auto login après inscription
    const sessionUser = { ...newUser, password: "" };
    localStorage.setItem("active_session", JSON.stringify(sessionUser));
    setUser(sessionUser);
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("active_session");
    setUser(null);
    window.location.href = "/"; // Redirection forcée
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);