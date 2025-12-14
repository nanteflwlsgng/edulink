import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AccountPage from "./pages/accountPage"; // Import de la nouvelle page
import Formations from "./pages/formations";

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
]);

export default router;