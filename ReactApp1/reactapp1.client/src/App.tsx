import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './sites/Home';
import Weather from './sites/Weather';
import Products from './sites/Products';
import Login from './sites/Login';
import UserManaging from './sites/UserManaging'; // Adjust the path as necessary

function App() {
    return (
        <Router>
            <nav>
                <ul className="flex space-x-4 justify-center">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/weather">Weather</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/usermanaging">User Management</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/usermanaging" element={<UserManaging />} />
            </Routes>
        </Router>
    );
}

export default App;