import { Link } from "react-router-dom";

export default function Navbar() {
  const isActive = (path) => location.pathname === path;
  return (
    <nav className="w-full gap-20 bg-white px-10 py-3 flex items-center justify-between z-40 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/icons8-éducation-64 1.png" alt="Logo" className="h-10 w-10" />
        <span className="text-lg font-bold text-[#370669]">EduLink</span>
      </div>

      {/* Liens du milieu */}
      <div className="hidden md:flex gap-4 text-gray-500 text-base font-medium">
        <Link to="/" className={`hover:text-[#370669] transition-colors ${isActive('/') ? 'text-[#370669] font-semibold' : 'text-gray-500 hover:text-[#370669]'}`}>Accueil</Link>
        <Link to="/formations" className={`hover:text-[#370669] transition-colors ${isActive('/formations') ? 'text-[#370669] font-semibold' : 'text-gray-500 hover:text-[#370669]'}`}>Formations</Link>
      </div>

      {/* Bouton Mon Compte -> Lien vers la page */}
      <div className="transition-transform transform hover:scale-105">
        <Link
          to="/compte" // Redirige vers la nouvelle page
          className="px-4 py-2 text-base bg-[#370669] font-semibold text-white rounded-lg"
        >
          Mon compte
        </Link>
      </div>
    </nav>
  );
}