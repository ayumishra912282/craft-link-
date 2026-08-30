import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import OTPAuthPage from './pages/OTPAuthPage';
import RegisterPage from './pages/RegisterPage';
import ArtisanDashboard from './pages/ArtisanDashboard';
import AIProductUploadPage from './pages/AIProductUploadPage';
import ArtisanProfilePage from './pages/ArtisanProfilePage';

function ProtectedArtisanRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
              {/* Public Routes */}
              <Route index element={<LandingPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="otp-login" element={<OTPAuthPage />} />
              <Route path="register" element={<RegisterPage />} />

              {/* Artisan Routes */}
              <Route
                path="artisan/dashboard"
                element={
                  <ProtectedArtisanRoute>
                    <ArtisanDashboard />
                  </ProtectedArtisanRoute>
                }
              />
              <Route
                path="artisan/products"
                element={
                  <ProtectedArtisanRoute>
                    <ArtisanDashboard />
                  </ProtectedArtisanRoute>
                }
              />
              <Route
                path="artisan/products/new"
                element={
                  <ProtectedArtisanRoute>
                    <AIProductUploadPage />
                  </ProtectedArtisanRoute>
                }
              />
              <Route
                path="artisan/profile"
                element={
                  <ProtectedArtisanRoute>
                    <ArtisanProfilePage />
                  </ProtectedArtisanRoute>
                }
              />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </AuthProvider>
  </ThemeProvider>
  </ErrorBoundary>
  );
}
