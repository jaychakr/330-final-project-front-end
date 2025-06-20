import './Profile.css'
import { useState, useEffect } from "react";
import Tile from '../Tile/Tile';
import { useParams, useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { jwtDecode } from 'jwt-decode';
import storage from "../db.js"
function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState("");
    const [changeUsername, setChangeUsername] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [bio, setBio] = useState("");
    const [changeBio, setChangeBio] = useState(false);
    const [newBio, setNewBio] = useState("");
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
    const token = localStorage.getItem('authToken');
    const user = token ? jwtDecode(token) : null;
    useEffect(() => {
      const downloadUserDetails = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/details/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }
          const userInfo = await response.json();
          setUsername(userInfo.username);
          setNewUsername(userInfo.username);
          setBio(userInfo.bio);
          setNewBio(userInfo.bio);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
      const getUserPhoto = async() => {
        await getDownloadURL(ref(storage, userId))
        .then((url) => {
          setProfilePhotoUrl(url);
        })
        .catch((e) => {
          alert(e);
        })
      } 
      const downloadPosts = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/byUserId/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const newPosts = await response.json();
          setPosts(newPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
      downloadUserDetails();
      getUserPhoto();
      downloadPosts();
    }, [userId]);
    const updateUsername = async () => {
      setUsername(newUsername);
      setChangeUsername(false);
      const data = { 
        username: newUsername
      };
      try {
        await fetch(import.meta.env.VITE_API_URL + '/auth/username', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
          console.error('Error:', error);
      }
    }
    const updateBio = async () => {
      setBio(newBio);
      setChangeBio(false);
      const data = { 
        bio: newBio
      };
      try {
        await fetch(import.meta.env.VITE_API_URL + '/auth/bio', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
          console.error('Error:', error);
      }
    }
    const startConversation = async () => {
      const data = { username: username };
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
        });
        const conversation = await response.json();
        navigate(`/chat/${conversation._id}`);
      } catch (error) {
          console.error('Error:', error);
      }
    }
    return (
      <div className="profile">
        <div className="intro">
          <div className="photo">
            <img src={profilePhotoUrl}/>
          </div>
          <div className="info">
            <div className="username">
              {
                changeUsername ? <input className="changeUsername" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}/> : <b>{ username }</b>
              }
              {
                changeUsername ? <button onClick={updateUsername}>Submit change</button> :
                user && (user.userId === userId ? <button onClick={() => setChangeUsername(true)}>Change username</button> :
                <button className="startConversation" onClick={startConversation}>Message</button>)
              }
              {
                changeUsername && <button onClick={() => setChangeUsername(false)}>Cancel</button>
              }
            </div>
            <div className="bio">
              {
                changeBio ? <textarea className="changeBio" rows={10} value={newBio} onChange={(e) => setNewBio(e.target.value)}/> : <p>{ bio }</p>
              }
              {
                changeBio ? <button onClick={updateBio}>Submit change</button> :
                user && user.userId === userId && <button onClick={() => setChangeBio(true)}>Edit Bio</button>
              }
              <br/>
              {
                changeBio && <button onClick={() => setChangeBio(false)}>Cancel</button>
              }
            </div>
          </div>
        </div>
        <div className="posts">
          {posts.map((post) => (
            <Tile key={post._id} post={post} />
          ))}
        </div>
        <br/>
      </div>
    );
}
  
export default Profile;