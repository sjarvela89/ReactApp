import { useState, useEffect } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is already logged in when the component mounts
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async () => {
        setError(null);

        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); // Store token
            setIsLoggedIn(true); // Set user as logged in
            window.location.href = "/dashboard"; // Redirect after login
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const response = await fetch("api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // Send the token in the Authorization header
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to log out");
                }

                // If the logout is successful, clear the token and redirect
                localStorage.removeItem("token");
                setIsLoggedIn(false); // Set user as logged out
                window.location.href = "/"; // Redirect to homepage after logout
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div>
            {!isLoggedIn ? (
                <>
                    <h2>Login</h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </>
            ) : (
                <div>
                    <h2>You are logged in</h2>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default Login;