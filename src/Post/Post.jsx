import './Post.css'
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { jwtDecode } from 'jwt-decode';
import storage from "../db.js";
import Comment from '../Comment/Comment';
function Post({post}) {
  const postRef = useRef(post || null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [username, setUsername] = useState("");
  const [userPhotoUrl, setUserPhotoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [deleted, setDeleted] = useState(false);
  const token = localStorage.getItem('authToken');
  const user = token ? jwtDecode(token) : null;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPost = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/byPostId/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const postObj = await response.json();
        return postObj;
      } 
      catch (error) {
        console.error('Error fetching post:', error);
      } 
    }
    const getUsername = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/details/${postRef.current.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const userInfo = await response.json();
        setUsername(userInfo.username);
      } 
      catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    const getUserPhoto = async() => {
      await getDownloadURL(ref(storage, postRef.current.userId))
      .then((url) => {
        setUserPhotoUrl(url);
      })
      .catch((e) => {
        alert(e);
      })
    }
    const getPhoto = async() => {
      await getDownloadURL(ref(storage, postRef.current._id))
      .then((url) => {
        setPhotoUrl(url);
      })
      .catch((e) => {
        alert(e);
      })
    }
    const getComments = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${postRef.current._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const comments = await response.json();
        setComments(comments);
      } 
      catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    const fetchData = async () => {
      if (!postRef.current) {
        postRef.current = await getPost();
      }
      setLoading(false);
      try {
        await getUsername();
        await getUserPhoto();
        await getPhoto();
        await getComments();
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [postId]);
  const checkAuth = async () => {
    if (!token) {
      navigate('/login');
    } else {
      if (newComment.length) {
        const data = { 
          description: newComment,
          postId: post._id
        };
        const token = localStorage.getItem('authToken');
        try {
          const response = await fetch(import.meta.env.VITE_API_URL + '/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
        });
        const comment = await response.json();
        setComments([...comments, comment])
        setNewComment("");
        } catch (error) {
        console.error('Error:', error);
        }
      }
    }
  }
  const deletePost = async () => {
    setDeleted(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/posts/byPostId/${postRef.current._id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch(e) {
      console.log(e);
    }
    const deleteRef = ref(storage, post._id);
    await deleteObject(deleteRef);
  };
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="post" style={{ display: deleted ? 'none' : 'block' }}>
      <div className="heading">
        <div className="user">
          <Link to={`/profile/${postRef.current.userId}`}><img src={userPhotoUrl} className="profile-photo"/></Link>
          <Link to={`/profile/${postRef.current.userId}`} className="user-link"><b><p>{username}</p></b></Link>
        </div>
        {
          user && user.userId === postRef.current.userId && <button className="delete" onClick={deletePost}>Delete</button>
        }
      </div>
      {
        postRef.current.fileType === 'image' ? <img src={photoUrl} className="post-photo"/> : <video src={photoUrl + '#t=0.001'} controls playsInline className="post-photo" />
      }
      <p>{postRef.current.description}</p>
      <p><b>Comments ({comments.length}):</b></p>
      <div className="comments">
        {
          comments.map(comment => <Comment comment={comment} key={comment._id}/>)
        }
      </div>
      <p><textarea onChange={(e) => setNewComment(e.target.value)} value={newComment}></textarea></p>
      <button className="newComment" onClick={checkAuth}>Add a new Comment</button>
    </div>
  );
}
  
export default Post;