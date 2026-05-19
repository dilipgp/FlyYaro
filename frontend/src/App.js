import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import FlightDetails from './pages/FlightDetails';
import BrandShowcase from './pages/BrandShowcase';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { CurrencyProvider } from './context/CurrencyContext';

function App() {
  return (
    <div className="App">
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Results />} />
            <Route path="/flight" element={<FlightDetails />} />
            <Route path="/brand" element={<BrandShowcase />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </div>
  );
}

export default App;
