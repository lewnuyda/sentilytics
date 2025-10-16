import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

// Layouts
import RootLayout from "../layouts/RootLayout";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import LandingPage from "../pages/Main/LandingPage";
import Sentilytics from "../pages/Main/Sentilytics";
import ThankYouPage from "../pages/Main/ThankYouPage";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Admin/Dashboard";

// ✅ Protect route if not logged in
const ProtectedRoute = ({ children }) => {
  const session = supabase.auth.getSession().then(({ data }) => data.session);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
  }, []);

  if (isAuthenticated === null) return null; // wait until checked
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ✅ Redirect logged-in users away from login
const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
  }, []);

  if (isAuthenticated === null) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/landing-page" replace />} />

        {/* Public pages */}
        <Route element={<RootLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/sentilytics" element={<Sentilytics />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
        </Route>

        {/* Protected admin pages */}
        <Route element={<AdminLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
