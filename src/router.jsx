import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AccountPage from "./pages/accountPage"; // Import de la nouvelle page
import Formations from "./pages/formations";
import Establishments from "./pages/Establishments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/compte", // Nouvelle route
    element: <AccountPage />,
  },
  {
    path: "/formations", // Nouvelle route
    element: <Formations />,
  },
  {
    path: "/etablissements", // Nouvelle route
    element: <Establishments />,
  },
]);

export default router;