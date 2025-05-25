import "./Header.css";
import instagram2 from '../assets/instagram2.jpg';
import instagram2_home from '../assets/instagram2_home.jpg';
import { jwtDecode } from 'jwt-decode';
import { Link, useLocation } from "react-router-dom";
function Nav() {
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  const user = token ? jwtDecode(token) : null;
  return (
    <header>
      <Link to="/" className="home-link"><img src={location.pathname === '/' ? instagram2_home : instagram2} className='logo'/></Link>
      {
          user && <Link to="/inbox"><button>Message Inbox</button></Link>
      }
      {
        user ? <Link to="/"><button onClick={() => localStorage.setItem('authToken', '')}>Log Out</button></Link> : <Link to="/login"><button>Sign In</button></Link>
      }
    </header>
  );
}

export default Nav;