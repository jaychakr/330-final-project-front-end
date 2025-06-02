import './ChatRoom.css';
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatRoom = () => {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');
	const [socket, setSocket] = useState(null);
	const tokenRef = useRef(localStorage.getItem('authToken'));
	const fetchMessages = async () => {
		try {
			const response = await fetch(import.meta.env.VITE_API_URL + '/messages', {
					headers: {
						'Authorization': `Bearer ${tokenRef.current}`
					},
				});
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
		const newSocket = io(import.meta.env.VITE_API_URL);
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
						<strong>{message.userId}:</strong> {message.message}
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