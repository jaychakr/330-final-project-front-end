import './Comment.css'
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import storage from "../db.js";
import { jwtDecode } from 'jwt-decode';
function Comment({comment, comments, setComments}) {
  const [userPhotoUrl, setUserPhotoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
  const [username, setUsername] = useState("");
  const token = localStorage.getItem('authToken');
  const user = token ? jwtDecode(token) : null;
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/details/${comment.userId}`);
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
    setComments(comments.filter(commentToFilter => commentToFilter !== comment));
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/comments/byCommentId/${comment._id}`, {
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
    <div className="comment">
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