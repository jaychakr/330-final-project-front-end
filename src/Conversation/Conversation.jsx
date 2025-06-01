import './Conversation.css'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Conversation({conversation, sender}) {
  const [recipientUsername, setRecipientUsername] = useState("");
  useEffect(() => {
    const recipientId = conversation.userId1 === sender ? conversation.userId2 : conversation.userId1;
    const getUsername = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/details/${recipientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const userInfo = await response.json();
        setRecipientUsername(userInfo.username);
      } 
      catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    getUsername();
  }, [conversation.userId1, conversation.userId2, sender]);
  return (
    <div className="conversation">
        <Link to={`/chat/${conversation._id}`}><button><b>{recipientUsername}</b></button></Link>
    </div>
  );
}
  
export default Conversation;
