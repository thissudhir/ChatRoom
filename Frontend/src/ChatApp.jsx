import React, { useState } from "react";
import { io } from "socket.io-client";

const ChatApp = () => {
  const [username, setUsername] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const startChatting = () => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    setIsChatting(true);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("chatMessage", { username, message });

    setChatMessages([...chatMessages, { username, message }]);

    setMessage("");
  };

  return (
    <div>
      {!isChatting ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={startChatting}>Start chatting</button>
        </div>
      ) : (
        <div>
          <div>
            {chatMessages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
