import './Chat.css';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../db.js";

const Chat = () => {
    const { conversationId } = useParams();
	const [messages, setMessages] = useState([]);
	const [token] = useState(localStorage.getItem('authToken'));
    const [user] = useState(token ? jwtDecode(token) : null);
	const [text, setText] = useState('');
	const [socket, setSocket] = useState(null);
	const [user1, setUser1] = useState(null);
	const [user1PhotoUrl, setUser1PhotoUrl] = useState(null);
	const [user2PhotoUrl, setUser2PhotoUrl] = useState(null);
	const [user1Username, setUser1Username] = useState(null);
	const [user2Username, setUser2Username] = useState(null);
	const sendMessage = () => {
		if (text && user) {
			socket.emit('chat message', { userId: user.userId, message: text, conversationId });
			setText('');
		}
	};
	useEffect(() => {
		const getConversation = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/conversations/${conversationId}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					},
				});
				const conversation = await response.json();
				setUser1(conversation.userId1.toString());
				await getDownloadURL(ref(storage, conversation.userId1.toString()))
					.then((url) => {
						setUser1PhotoUrl(url);
      				})
      				.catch((e) => {
						alert(e);
      				});
				await getDownloadURL(ref(storage, conversation.userId2.toString()))
					.then((url) => {
						setUser2PhotoUrl(url);
					})
					.catch((e) => {
						alert(e);
					});
				const response1 = await fetch(`${import.meta.env.VITE_API_URL}/auth/details/${conversation.userId1.toString()}`);
				if (!response1.ok) {
					throw new Error('Failed to fetch user1 info');
				}
				const userInfo1 = await response1.json();
				setUser1Username(userInfo1.username);
				const response2 = await fetch(`${import.meta.env.VITE_API_URL}/auth/details/${conversation.userId2.toString()}`);
				if (!response2.ok) {
					throw new Error('Failed to fetch user2 info');
				}
				const userInfo2 = await response2.json();
				setUser2Username(userInfo2.username);
			} catch (error) {
				console.error('Error fetching conversation:', error);
			}
		}
        const fetchMessages = async () => {
		    try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/${conversationId}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					},
				});
			    const data = await response.json();
			    setMessages(data);
		    } catch (error) {
			    console.error('Error fetching messages:', error);
		    }
	    };
		getConversation();
		fetchMessages();
		const newSocket = io(import.meta.env.VITE_API_URL);
    	setSocket(newSocket);
    	newSocket.on('chat message', (msg) => {
			if (msg.conversationId === conversationId) {
				setMessages((prevMessages) => [...prevMessages, msg]);
			}
    	});
		return () => {
      		newSocket.disconnect();
    	};
	}, [conversationId, token]);
	useEffect(() => {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: 'smooth'
		});
	}, [messages]);
	return (
		<div>
			<div className="conversation-header">
				<h2>Chat Room with </h2>
				<img src={user.userId.toString() === user1 ? user2PhotoUrl : user1PhotoUrl} className="partner"/>
				<h2>{user.userId.toString() === user1 ? user2Username : user1Username}</h2>
			</div>
			<div className='messages'>
				{messages.map((message, index) => (
					<div key={index} className={`message ${message.userId === user.userId ? 'recipient' : 'sender'}`}>
						<Link to={`/profile/${message.userId.toString()}`}><img src={message.userId.toString() === user1 ? user1PhotoUrl : user2PhotoUrl} className="profile-picture"/></Link>
						<Link to={`/profile/${message.userId.toString()}`} className="user-link"><strong>{message.userId.toString() === user1 ? user1Username : user2Username}:</strong></Link>
						{message.message}
					</div>
				))}
			</div>
			<div>
				<input
					type="text"
					placeholder="Type your message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="typeMessage"
				/>
				<button onClick={sendMessage} className="sendMessage">Send</button>
			</div>
		</div>
	);
};

export default Chat;