import './Footer.css'
import { useNavigate } from "react-router-dom";
function Footer() {
    const navigate = useNavigate();
    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        } else {
            navigate('/addPost');
        }
    }
    return (
        <footer>
            <button onClick={checkAuth}>Make a New Post</button>
        </footer>
    );
}
  
export default Footer;