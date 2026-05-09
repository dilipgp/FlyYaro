import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import FlightDetails from './pages/FlightDetails';
import BrandShowcase from './pages/BrandShowcase';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';

function AppRouter() {
  const location = useLocation();

  // CRITICAL: Detect Emergent OAuth fragment synchronously during render
  // (NOT in useEffect) — prevents race conditions with the AuthProvider's /me check.
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Results />} />
      <Route path="/flight" element={<FlightDetails />} />
      <Route path="/brand" element={<BrandShowcase />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </CurrencyProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
