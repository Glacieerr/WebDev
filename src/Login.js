import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Updated to named import

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false); 
    const [loginFailed, setLoginFailed] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setLoginFailed(false);
        try {
            const response = await axios.post('http://localhost:5001/login', {
                username,
                password
            });

            console.log(response.data);

            if (response.status === 200 && response.data.token) {
                alert('Login Successful');
                localStorage.clear();
                
                // Decode the token to get the username
                const decodedToken = jwtDecode(response.data.token); // Use jwtDecode here
                localStorage.setItem('loggedInUser', decodedToken.username || 'User'); // Ensure "username" exists in token

                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/home'); // Navigate to Home page after login
                }, 1000); 
            } else {
                setError(response.data.message || 'Login failed. Please try again.');
                setLoginFailed(true);
                setTimeout(() => {
                    setLoginFailed(false);
                }, 6000);
            }
        } catch (error) {
            setError('Error: ' + error.message);
            setLoginFailed(true);
            setTimeout(() => {
                setLoginFailed(false);
            }, 6000);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleLogin}>
            <label>User ID: </label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <br />

            <label>Password: </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <br />

            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>

            {success && <p style={{ color: 'green' }}>Login successful! Redirecting...</p>}
            {loginFailed && <p style={{ color: 'red' }}>Login failed. Please try again.</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <br />

            <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </form>
    );
};

export default Login;
