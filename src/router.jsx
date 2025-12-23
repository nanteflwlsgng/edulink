import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 1. On importe le Provider

// Import des pages
import App from "./App"; // Page d'accueil
import AccountPage from "./pages/accountPage"; // Attention à la majuscule (Convention React)
import Formations from "./pages/formations";
import Establishments from "./pages/Establishments";
import Dashboard from "./pages/studentDashboard"; // 2. On importe le nouveau Dashboard
import FormationDetailsPage from "./pages/formationDetailsPage";

// 3. On crée un Layout Racine qui englobe toute l'app
// C'est lui qui distribue la "session" à toutes les pages via <Outlet />
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet /> 
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    // On définit le layout racine comme parent
    element: <RootLayout />,
    // Toutes tes pages deviennent des enfants de ce layout
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/compte",
        element: <AccountPage />,
      },
      {
        path: "/formations",
        element: <Formations />,
      },
      {
        path: "/etablissements",
        element: <Establishments />,
      },
      {
        path: "/formations/:id",
        element: <FormationDetailsPage/>,
      },
      {
        path: "/dashboard", // 4. La route protégée (accessible via logique dans le composant)
        element: <Dashboard/>,
      },
    ],
  },
]);

export default router;