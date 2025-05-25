import './LoginPage.css'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { username, password };
        try {
            const response = await fetch('https://330-final-project-production-95c7.up.railway.app/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            localStorage.setItem('authToken', result.token);
            const decoded = jwtDecode(result.token);
            navigate(`/profile/${decoded.userId}`);
        } catch (error) {
            alert('invalid login!');
            console.error('Error:', error);
        }
    }
    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label><br/>
                <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)}/><br/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/><br/><br/>
                <input type="submit" value="Log in" className="submit"></input><br/><br/>
                <button className="forgot">Forgot Password</button><br/><br/><br/>
                <Link to="/signUp"><button className="create">Create new account</button></Link>
            </form>  
        </div>
    );
}
  
export default LoginPage;