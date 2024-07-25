import { createBrowserRouter } from "react-router-dom";
import NotFound from "./Components/NotFound";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Links from "./Components/Links";
import ExpenseStatistics from "./Components/Expenses";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/Links",
        element: <Links />,
      },
      {
        path: "/Expenses",
        element: <ExpenseStatistics />,
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
