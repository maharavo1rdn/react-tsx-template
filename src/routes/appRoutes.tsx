import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { AppLayout } from "@components/layout/AppLayout";
import CustomerCreate from "@pages/CustomerCreate";
import Customers from "@pages/Customers";
import Dashboard from "@pages/Dashboard";
import Login from "@pages/Login";
import NotFound from "@pages/NotFound";
import Settings from "@pages/Settings";
import Support from "@pages/Support";

const privateRoutes: RouteObject[] = [
  { index: true, element: <Navigate to="/dashboard" replace /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "customers", element: <Customers /> },
  { path: "customers/create", element: <CustomerCreate /> },
  { path: "settings", element: <Settings /> },
  { path: "support", element: <Support /> },
  { path: "*", element: <NotFound /> },
];

export const appRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: privateRoutes,
  },
];
