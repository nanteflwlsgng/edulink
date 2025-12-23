import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, LogOut, Menu, X, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function StudentNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-[90] border-b border-gray-100 font-poppins transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-slate-900 tracking-tighter hover:opacity-80 transition-opacity">
          My<span className="text-[#18B49C]">School</span>.
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-[#18B49C]' : 'text-gray-500 hover:text-slate-900'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link 
            to="/formations" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/formations') ? 'text-[#18B49C]' : 'text-gray-500 hover:text-slate-900'}`}
          >
            <BookOpen size={18} /> Formations
          </Link>
        </div>

        {/* User Profile & Logout */}
        <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#18B49C] to-[#27b6d8] flex items-center justify-center text-white font-bold shadow-lg shadow-[#18B49C]/20">
                    {user?.name?.charAt(0) || "U"}
                </div>
            </div>
            
            <button 
                onClick={logout}
                className="group p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-300"
                title="Se déconnecter"
            >
                <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
           <Link to="/dashboard" className="flex items-center gap-3 text-lg font-medium text-slate-900">
             <LayoutDashboard size={20} /> Dashboard
           </Link>
           <Link to="/formations" className="flex items-center gap-3 text-lg font-medium text-slate-900">
             <BookOpen size={20} /> Formations
           </Link>
           <hr className="border-gray-100" />
           <div className="flex items-center justify-between">
             <span className="font-bold text-slate-900">{user?.name}</span>
             <button onClick={logout} className="text-red-500 text-sm font-bold uppercase tracking-wider">Déconnexion</button>
           </div>
        </div>
      )}
    </nav>
  );
}