import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import FlightDetails from './pages/FlightDetails';
import BrandShowcase from './pages/BrandShowcase';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Results />} />
          <Route path="/flight" element={<FlightDetails />} />
          <Route path="/brand" element={<BrandShowcase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
