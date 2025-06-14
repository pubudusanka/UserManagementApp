import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { authService } from '../services/authService';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try{
            await authService.login(username,passowrd);
            navigate("/");
        }
        catch{
            setError("Login failed. Please check your credentials.")
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="form-name">
                        <label htmlFor="username">Username</label>
                        <input 
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                        />
                    </div>
                    <div className="form-name">
                        <label htmlFor="password">Password</label>
                        <input 
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Log in
                    </button>
                    <p>
                        Don't have an account ? <Link to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;