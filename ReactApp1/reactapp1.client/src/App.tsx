import { useEffect, useState } from 'react';
import './App.css';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './sites/Home';
import Weather from './sites/Weather';
import WeatherForecast from './sites/Weather';
import Products from './sites/Products';

// Define the forecast type
interface Forecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

function App() {
    return (
        <Router>
          <nav>
            <ul className="flex space-x-4">
                    <Link to="/">Home</Link>
                <br></br>
                <Link to="/weather">Weather</Link>
                <br></br>
                <Link to="/products">Products</Link>
            </ul>
          </nav>
    
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </Router>
      );
}

export default App;