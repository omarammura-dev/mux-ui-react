import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import ExpenseStatistics from "./Components/Expenses";
import Links from "./Components/Links";
import Login from "./Components/Login";
import NotFound from "./Components/NotFound";
import SignUp from "./Components/SignUp";
import PasswordReset from "./Components/ForgotPassword";
import FileStorageView from "./Components/FileStorageView";
import ProtectedRoute from "./Components/ProtectedRoute";

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
      {
        path: "/file-storage",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <FileStorageView />
          </ProtectedRoute>
        ),
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
    path: "/auth/reset-password",
    element: <PasswordReset />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
