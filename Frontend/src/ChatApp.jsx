import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ChatApp = () => {
  const [username, setUsername] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on("addUser", (users) => {
        console.log("User added:", users);
      });

      socket.on("chatMessage", (data) => {
        console.log("Received message:", data);
        setChatMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on("users", (users) => {
        console.log("Connected Users:", users);
      });
    }
  }, [socket]);

  const startChatting = () => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    setIsChatting(true);

    newSocket.emit("addUser", username);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("chatMessage", { username, message });

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
