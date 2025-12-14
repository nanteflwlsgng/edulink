import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full gap-20 bg-white px-10 py-3 flex items-center justify-between z-40 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/icons8-éducation-64 1.png" alt="Logo" className="h-10 w-10" />
        <span className="text-base font-bold text-[#370669]">EduLink</span>
      </div>

      {/* Liens du milieu */}
      <div className="hidden md:flex gap-4 text-gray-900 text-sm">
        <Link to="/" className="hover:text-[#370669] transition-colors">Accueil</Link>
        <Link to="/formations" className="hover:text-[#370669] transition-colors">Formations</Link>
        <Link to="/etablissements" className="hover:text-[#370669] transition-colors">Établissements</Link>
      </div>

      {/* Bouton Mon Compte -> Lien vers la page */}
      <div className="transition-transform transform hover:scale-105">
        <Link
          to="/compte" // Redirige vers la nouvelle page
          className="px-4 py-2 text-sm bg-[#683cc7] font-semibold text-white rounded-full hover:bg-[#532e9e] transition-colors"
        >
          Mon compte
        </Link>
      </div>
    </nav>
  );
}