import './Chat.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
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
	const [user2, setUser2] = useState(null);
	const [user1PhotoUrl, setUser1PhotoUrl] = useState(null);
	const [user2PhotoUrl, setUser2PhotoUrl] = useState(null);
	const sendMessage = () => {
		if (text && user) {
			socket.emit('chat message', { user: user.username, userId: user.userId, message: text, conversationId });
			setText('');
		}
	};
	useEffect(() => {
		const getConversation = async () => {
			try {
				const response = await fetch(`https://330-final-project-production-95c7.up.railway.app/conversations/${conversationId}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					},
				});
				const conversation = await response.json();
				setUser1(conversation.userId1.toString());
				setUser2(conversation.userId2.toString());
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
			} catch (error) {
				console.error('Error fetching conversation:', error);
			}
		}
        const fetchMessages = async () => {
		    try {
			    const response = await fetch(`https://330-final-project-production-95c7.up.railway.app/messages/${conversationId}`);
			    const data = await response.json();
			    setMessages(data);
		    } catch (error) {
			    console.error('Error fetching messages:', error);
		    }
	    };
		getConversation();
		fetchMessages();
		const newSocket = io('https://330-final-project-production-95c7.up.railway.app');
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
	return (
		<div>
			<h2>Chat Room</h2>
			<div className='messages'>
				{messages.map((message, index) => (
					<div key={index} className={`message ${message.user === user.username ? 'recipient' : 'sender'}`}>
						<img src={message.userId.toString() === user1 ? user1PhotoUrl : user2PhotoUrl} className="profile-picture"/><strong>{message.user}:</strong> {message.message}
					</div>
				))}
			</div>
			<div>
				<input
					type="text"
					placeholder="Type your message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
};

export default Chat;