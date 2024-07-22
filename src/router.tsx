import { createBrowserRouter } from "react-router-dom";
import NotFound from "./Components/NotFound";
import Dashboard from "./Components/Dashboard"; // Changed import
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Links from "./Components/Links";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/Links",
        element: <Links />,
      },
    ],
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
