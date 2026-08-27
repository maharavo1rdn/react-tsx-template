import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import Dashboard from "../features/dashboard/Dashboard";
import KYCValidation from "../features/kyc/KYCValidation";
import TransactionsMonitoring from "../features/transactions/TransactionsMonitoring";
import SuspensionsManagement from "../features/suspensions/SuspensionsManagement";
import AuditLogs from "../features/audit/AuditLogs";
import Support from "../features/Support";
import Login from "../features/auth/Login";
import NotFound from "../shared/errors/NotFound";
import Settings from "../features/settings/Settings";

const privateRoutes: RouteObject[] = [
  { index: true, element: <Navigate to="/dashboard" replace /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "kyc", element: <KYCValidation /> },
  { path: "transactions", element: <TransactionsMonitoring /> },
  { path: "suspensions", element: <SuspensionsManagement /> },
  { path: "audit-logs", element: <AuditLogs /> },
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
