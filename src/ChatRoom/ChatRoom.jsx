import './ChatRoom.css';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const ChatRoom = () => {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');
	const [socket, setSocket] = useState(null);
	const fetchMessages = async () => {
		try {
			const response = await fetch('https://330-final-project-production-95c7.up.railway.app/messages');
			const data = await response.json();
			setMessages(data);
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	};
	const sendMessage = () => {
		if (message && user) {
			socket.emit('chat message', { user, message });
			setMessage('');
		}
	};
	useEffect(() => {
		fetchMessages();
		const newSocket = io('https://330-final-project-production-95c7.up.railway.app');
    	setSocket(newSocket);
    	newSocket.on('chat message', (msg) => {
      		setMessages((prevMessages) => [...prevMessages, msg]);
    	});
		return () => {
      		newSocket.disconnect();
    	};
	}, []);
	return (
		<div>
			<h2>Chat Room</h2>
			<ul>
				{messages.map((message) => (
					<li key={String(message._id)}>
						<strong>{message.user}:</strong> {message.message}
					</li>
				))}
			</ul>
			<div>
				<input
					type="text"
					placeholder="Your name"
					value={user}
					onChange={(e) => setUser(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Type your message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
};

export default ChatRoom;