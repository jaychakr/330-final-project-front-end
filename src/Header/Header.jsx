import "./Header.css";
import instagram2 from '../assets/instagram2.jpg';
import instagram2_home from '../assets/instagram2_home.jpg';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../db.js";
function Header() {
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  const user = token ? jwtDecode(token) : null;
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  useEffect(() => {
    const getUserPhoto = async() => {
      await getDownloadURL(ref(storage, user.userId))
      .then((url) => {
        setUserPhotoUrl(url);
      })
      .catch((e) => {
        alert(e);
      })
    }
    if (user) {
      getUserPhoto();
    }
  }, [user]);
  const logout = () => {
    localStorage.setItem('authToken', '');
    setUserPhotoUrl(null);
  }
  return (
    <header>
      <Link to="/" className="home-link"><img src={location.pathname === '/' ? instagram2_home : instagram2} className='logo'/></Link>
      {
          user && <Link to="/inbox"><button>Message Inbox</button></Link>
      }
      {
        userPhotoUrl && <Link to={`/profile/${user.userId}`}><img className="profile-photo" src={userPhotoUrl} /></Link>
      }
      {
        user ? <Link to="/"><button onClick={logout}>Log Out</button></Link> : <Link to="/login"><button>Sign In</button></Link>
      }
    </header>
  );
}

export default Header;