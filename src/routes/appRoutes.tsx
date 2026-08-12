import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { AppLayout } from "@components/layout/AppLayout";
import CustomerCreate from "@/features/customers/CustomerCreate";
import Customers from "@/features/customers/Customers";
import Dashboard from "@/features/dashboard/Dashboard";
import Login from "@/features/auth/Login";
import NotFound from "@/shared/errors/NotFound";
import Settings from "@/features/settings/Settings";
import Support from "@features/Support";

const privateRoutes: RouteObject[] = [
  { index: true, element: <Navigate to="/dashboard" replace /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "customers", element: <Customers /> },
  { path: "customers/create", element: <CustomerCreate /> },
  { path: "settings", element: <Settings /> },
  { path: "support", element: <Support /> },
];

export const appRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
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
