import './Comment.css'
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import storage from "../db.js";
function Comment({comment}) {
  const [userPhotoUrl, setUserPhotoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
  const [username, setUsername] = useState("");
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
  return (
    <div className="comment">
      <Link to={`/profile/${comment.userId}`}><img src={userPhotoUrl}/></Link>
      <div className="text">
        <Link to={`/profile/${comment.userId}`} className="user-link"><b>{username}</b></Link>
        <p dangerouslySetInnerHTML={{ __html: comment.description }} />
      </div>
    </div>
  );
}
  
export default Comment;