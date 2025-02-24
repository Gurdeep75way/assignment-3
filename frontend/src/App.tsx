import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthenticatedLayout from "./layouts/Authanticated";
import BasicLayout from "./layouts/Basic";
import { useAppSelector } from "./store/store";

// Lazy-loaded Components
const Home = lazy(() => import("./pages/homepage"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const ContactUs = lazy(() => import("./pages/contact"));
const PrivacyPolicy = lazy(() => import("./pages/policy"));
const NotFound = lazy(() => import("./pages/notfound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const WarehousePage = lazy(() => import("./pages/WarehousePage"));
const StockAlertPage = lazy(() => import("./pages/StockAlertPage"));

// Protected Route Component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? element : <Navigate to="/404" replace />;
};

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Protected Routes for Authenticated Users */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/alerts" element={<ProtectedRoute element={<StockAlertPage />} />} />
          <Route path="/warehouses" element={<ProtectedRoute element={<WarehousePage />} />} />
          <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} />} />
          <Route path="/reports" element={<ProtectedRoute element={<ReportsPage />} />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/policy" element={<PrivacyPolicy />} />
        </Route>

        {/* Public Routes */}
        <Route element={<BasicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
