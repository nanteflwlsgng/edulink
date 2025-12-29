import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Vérifier la session active au chargement
    const storedUser = localStorage.getItem("active_session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- FONCTION DE LOGIN (Universelle) ---
  const login = (email, password) => {
    // 1. Chercher dans les ÉTUDIANTS
    const students = JSON.parse(localStorage.getItem("student_accounts") || "[]");
    const foundStudent = students.find(u => u.email === email && u.password === password);

    if (foundStudent) {
      const sessionUser = { ...foundStudent, password: "" }; // Sécurité basique
      localStorage.setItem("active_session", JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true, user: sessionUser };
    }

    // 2. Chercher dans les ÉCOLES (Si pas trouvé chez les étudiants)
    const schools = JSON.parse(localStorage.getItem("school_accounts") || "[]");
    const foundSchool = schools.find(u => u.email === email && u.password === password);

    if (foundSchool) {
      const sessionUser = { ...foundSchool, password: "" };
      localStorage.setItem("active_session", JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true, user: sessionUser };
    }

    return { success: false, message: "Email ou mot de passe incorrect." };
  };

  // --- FONCTION D'INSCRIPTION (Avec Rôle) ---
  const register = (userData, roleType) => {
    // roleType doit être 'student' ou 'school'
    const storageKey = roleType === 'school' ? "school_accounts" : "student_accounts";
    const storedAccounts = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    // Vérification doublon
    if (storedAccounts.find(u => u.email === userData.email)) {
      return { success: false, message: "Cet email existe déjà." };
    }

    // Création du user avec ID et ROLE
    const newUser = { 
        id: Date.now(), 
        ...userData, 
        role: roleType, // 'student' ou 'school'
        // Pour les écoles, on peut initier des champs vides pour le profil
        ...(roleType === 'school' && {
            schoolName: userData.firstName ? `${userData.firstName} School` : "Nouvelle École",
            logo: "",
            description: "",
            website: ""
        })
    };

    storedAccounts.push(newUser);
    localStorage.setItem(storageKey, JSON.stringify(storedAccounts));
    
    // Auto login
    const sessionUser = { ...newUser, password: "" };
    localStorage.setItem("active_session", JSON.stringify(sessionUser));
    setUser(sessionUser);
    
    return { success: true, user: sessionUser };
  };

  // --- MISE À JOUR DU PROFIL (Persistance) ---
  const updateUser = (updatedData) => {
    if (!user) return;

    const newUserData = { ...user, ...updatedData };
    setUser(newUserData); // Mise à jour State
    localStorage.setItem("active_session", JSON.stringify(newUserData)); // Mise à jour Session

    // Mise à jour dans la "Base de données" (localStorage)
    const storageKey = user.role === 'school' ? "school_accounts" : "student_accounts";
    const accounts = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    const updatedAccounts = accounts.map(acc => 
        acc.id === user.id ? { ...acc, ...updatedData } : acc
    );
    
    localStorage.setItem(storageKey, JSON.stringify(updatedAccounts));
  };

  const logout = () => {
    localStorage.removeItem("active_session");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);