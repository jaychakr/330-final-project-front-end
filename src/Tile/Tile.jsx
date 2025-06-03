import './Tile.css'
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import storage from "../db.js"
function Tile({post}) {
  const [photoUrl, setPhotoUrl] = useState("https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-2011.png");
  const [objectFit, setObjectFit] = useState('contain');
  useEffect(() => {
    const getPhoto = async() => {
      await getDownloadURL(ref(storage, post._id))
      .then((url) => {
        setPhotoUrl(url);
      })
      .catch((e) => {
        alert(e);
      })
    }
    getPhoto();
  }, [post._id]);
  const handleLoadedMetadata = (event) => {
    const video = event.target;
    const naturalWidth = video.videoWidth;
    const naturalHeight = video.videoHeight;
    if (naturalWidth > naturalHeight) {
      setObjectFit('cover');
    } else {
      setObjectFit('contain');
    }
  };
  return (
    <div className="tile">
      <Link to={`/post/${post._id}`}>
      {
        post.fileType === 'image' ? 
        <img src={photoUrl}/> : 
        <video src={photoUrl} controls playsInline onLoadedMetadata={handleLoadedMetadata} style={{  objectFit: objectFit }}>
        </video>
      }
      </Link>
    </div>
  );
}
  
export default Tile;