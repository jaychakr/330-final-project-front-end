import './Comment.css'
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import storage from "../db.js";
import { jwtDecode } from 'jwt-decode';
function Comment({comment}) {
  const [userPhotoUrl, setUserPhotoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
  const [username, setUsername] = useState("");
  const token = localStorage.getItem('authToken');
  const user = token ? jwtDecode(token) : null;
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    const getUserPhoto = async() => {
      await getDownloadURL(ref(storage, comment.userId))
      .then((url) => {
        setUserPhotoUrl(url);
      })
      .catch((e) => {
        alert(e);
      })
    }
    const getUsername = async() => {
      try {
        const response = await fetch(`https://330-final-project-production-95c7.up.railway.app/auth/details/${comment.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const userInfo = await response.json();
        setUsername(userInfo.username);
      } 
      catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    getUsername();
    getUserPhoto();
  }, [comment.userId]);
  const deleteComment = async () => {
    setDeleted(true);
    try {
      await fetch(`https://330-final-project-production-95c7.up.railway.app/comments/byCommentId/${comment._id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch(e) {
      console.log(e);
    }
  };
  return (
    <div className="comment" style={{ display: deleted ? 'none' : 'flex' }}>
      <div className="user">
        <Link to={`/profile/${comment.userId}`}><img src={userPhotoUrl}/></Link>
        <div className="text">
          <Link to={`/profile/${comment.userId}`} className="user-link"><b>{username}</b></Link>
          <p dangerouslySetInnerHTML={{ __html: comment.description }} />
        </div>
      </div>
      {
        user && user.userId ===comment.userId && <button className="delete" onClick={deleteComment}>Delete</button>
      }
    </div>
  );
}
  
export default Comment;