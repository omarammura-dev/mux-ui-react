import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import ExpenseStatistics from "./Components/Expenses";
import Links from "./Components/Links";
import Login from "./Components/Login";
import NotFound from "./Components/NotFound";
import SignUp from "./Components/SignUp";
import PasswordReset from "./Components/ForgotPassword";

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
      }
    ],
  },
  {
    path: "/auth",
    element: <Login />,
    children: [
      {
        path: "/login",
        element: <SignUp />,
      }, {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/reset-password",
        element: <PasswordReset />
      }
    ]

  },


  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
