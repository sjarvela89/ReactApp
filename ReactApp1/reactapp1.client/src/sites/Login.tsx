import { useState, useEffect } from "react";

const Login = () => {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [requiresMfa, setRequiresMfa] = useState(false);
    const [mfaCode, setMfaCode] = useState("");

    // Check if the user is already logged in when the component mounts
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true);
        }
    }, []);

    const enableMfa = async () => {
        const response = await fetch("api/auth/enable-mfa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setQrCode(imageUrl);
        }
    };

    const handleLogin = async () => {
        localStorage.setItem("username", username?.toString()??"");
        const response = await fetch("api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.requiresMfa) {
            setRequiresMfa(true);
        } else {
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        }
    };

    const handleVerifyMfa = async () => {
        const response = await fetch("api/auth/verify-mfa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, code: mfaCode }),
        });
        try {
            const data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.log(error);
            window.location.href = "/dashboard";
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
                requiresMfa ? (
                    <div>
                        <h2>Enter MFA Code</h2>
                        <input
                            type="text"
                            placeholder="MFA Code"
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value)}
                        />
                        <button onClick={handleVerifyMfa}>Verify</button>
                    </div>
                ) : (
                    <div>
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
                    </div>
                )
            ) : (
                <div>
                    <h2>You are logged in</h2>
                    <button onClick={enableMfa}>Enable MFA</button>
                    {qrCode && <img src={qrCode} alt="Scan this QR code with Microsoft Authenticator" />}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default Login;