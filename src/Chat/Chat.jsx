import './Chat.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';

const Chat = () => {
    const { conversationId } = useParams();
	const [messages, setMessages] = useState([]);
	const [token] = useState(localStorage.getItem('authToken'));
    const [user] = useState(token ? jwtDecode(token) : null);
	const [text, setText] = useState('');
	const [socket, setSocket] = useState(null);
	const sendMessage = () => {
		if (text && user) {
			socket.emit('chat message', { user: user.username, message: text, conversationId });
			setText('');
		}
	};
	useEffect(() => {
        const fetchMessages = async () => {
		    try {
			    const response = await fetch(`https://330-final-project-production-95c7.up.railway.app/messages/${conversationId}`);
			    const data = await response.json();
			    setMessages(data);
		    } catch (error) {
			    console.error('Error fetching messages:', error);
		    }
	    };
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
	}, [conversationId]);
	return (
		<div>
			<h2>Chat Room</h2>
			<ul>
				{messages.map((message, index) => (
					<li key={index}>
						<strong>{message.user}:</strong> {message.message}
					</li>
				))}
			</ul>
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