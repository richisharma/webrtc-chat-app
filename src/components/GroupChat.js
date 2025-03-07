import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { sendMessage, getUserInfoFromToken } from "../services/api";

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const user = getUserInfoFromToken();
  const userId = user ? user.UserId : null;
  const MESSAGING_SERVICE_URL = process.env.REACT_APP_MESSAGING_SERVICE_URL;
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${MESSAGING_SERVICE_URL}/chatHub`, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.start()
      .then(() => {
        console.log("✅ SignalR connected in GroupChat");
      })
      .catch(err => console.error("❌ GroupChat SignalR Connection Error:", err));

    newConnection.on("ReceiveMessage", (sender, receivedMessage, room) => {
      // Only process messages for the current room
      if (room === roomId) {
        setMessages(prev => [...prev, { sender, message: receivedMessage, room }]);
      }
    });

    newConnection.on("ReceiveSystemMessage", (systemMessage) => {
      console.log("System message:", systemMessage);
    });

    return () => {
      newConnection.stop();
    };
  }, [MESSAGING_SERVICE_URL, roomId]);

  const joinRoom = async () => {
    if (connection && roomId.trim()) {
      try {
        await connection.invoke("JoinRoom", roomId);
        setJoined(true);
        console.log(`Joined room: ${roomId}`);
      } catch (err) {
        console.error("❌ Error joining room:", err);
      }
    }
  };

  const leaveRoom = async () => {
    if (connection && roomId.trim()) {
      try {
        await connection.invoke("LeaveRoom", roomId);
        setJoined(false);
        setMessages([]);
        console.log(`Left room: ${roomId}`);
      } catch (err) {
        console.error("❌ Error leaving room:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!joined) {
      alert("Please join a room first.");
      return;
    }
    if (!message.trim()) return;

    const payload = { sender: userId, roomId, message: message.trim() };
    console.log("📡 Sending group message:", payload);
    try {
      await sendMessage(payload);
      setMessage("");
    } catch (error) {
      console.error("❌ Error sending group message:", error);
    }
  };

  return (
    <div>
      <h2>Group Chat</h2>
      <p>Welcome, {user ? user.FullName : "Guest"}</p>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
      />
      <button onClick={joinRoom}>Join Room</button>
      <button onClick={leaveRoom}>Leave Room</button>
      {joined && (
        <>
          <h3>Room: {roomId}</h3>
          <div>
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender === userId ? "You" : msg.sender}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </>
      )}
    </div>
  );
};

export default GroupChat;