import "./Inbox.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Conversation from '../Conversation/Conversation';
function Inbox() {
    const navigate = useNavigate();
    const [recipient, setRecipient] = useState("");
    const [conversations, setConversations] = useState([]);
    const [token] = useState(localStorage.getItem('authToken'));
    const [user] = useState(token ? jwtDecode(token) : null);
    useEffect(() => {
        const getConversations = async() => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/conversations/byUserId/${user.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch conversation info');
                }
                const newConversations = await response.json();
                setConversations(newConversations);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        if (user) {
            getConversations();
        }
    }, [token, user]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { username: recipient };
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
            if (response.status === 400) {
                throw new Error('user does not exist!');
            }
            const conversation = await response.json();
            const duplicate = conversations.some(conversationToCheck => conversationToCheck._id.toString() === conversation._id.toString());
            if (duplicate) {
                navigate(`/chat/${conversation._id.toString()}`);
            } else {
                setConversations([conversation, ...conversations]);
            }
        } catch (error) {
            alert(error);
            console.error('Error:', error);
        }
    }
    return (
        <div className="inbox"> 
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">User to Chat With:</label><br/>
                <input type="text" id="username" name="username" onChange={(e) => setRecipient(e.target.value)}/><br/><br/>
                <input type="submit" value="Start a New Conversation" className="submit"></input><br/><br/>
            </form>
            {
                conversations.map(conversation => <Conversation key={conversation._id} conversation={conversation} sender={user.userId}/>)
            }
        </div>
    );
}

export default Inbox;