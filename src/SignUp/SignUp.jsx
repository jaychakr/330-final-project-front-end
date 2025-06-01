import './SignUp.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { ref, uploadBytes } from "firebase/storage";
import storage from "../db.js"
function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [file, setFile] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        const data = { email, username, password };
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            localStorage.setItem('authToken', result.token);
            const decoded = jwtDecode(result.token);
            const storageRef = ref(storage, decoded.userId);
            await uploadBytes(storageRef, file);
            navigate(`/profile/${decoded.userId}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div className="signup">
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label><br/>
                <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required/><br/><br/>
                <label htmlFor="username">Username:</label><br/>
                <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required/><br/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required/><br/><br/>
                <label htmlFor="confirm">Confirm Password:</label><br/>
                <input type="password" id="confirm" name="confirm" onChange={(e) => setConfirm(e.target.value)} required/><br/><br/>
                <label htmlFor="photo">Profile Picture:</label><br/><br/>
                <input type="file" id="photo" name="photo" onChange={(e) => setFile(e.target.files[0])} className="file" required/><br/><br/><br/>
                <input type="submit" value="Sign Up" className="submit"></input><br/><br/>
            </form>  
        </div>
    );
}
  
export default SignUp;