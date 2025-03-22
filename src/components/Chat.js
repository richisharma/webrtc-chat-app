import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { sendMessage, getUserInfoFromToken, fetchUsers } from "../services/api";

const Chat = () => {
  const [users, setUsers] = useState([]); // Stores list of users
  const [selectedUser, setSelectedUser] = useState(''); // Selected user for one-on-one chat
  const [messages, setMessages] = useState([]); // Chat messages
  const [message, setMessage] = useState(""); // Input message

  const user = getUserInfoFromToken(); // Get logged-in user info

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_MESSAGING_SERVICE_URL}/chatHub`, {
      accessTokenFactory: () => localStorage.getItem("token"),
    })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  useEffect(() => {
    // Fetch users on component mount
    const fetchUserList = async () => {
      try {
        const userList = await fetchUsers();
        console.log(userList);
        setUsers(userList.filter(u => u.id !== user?.UserId)); // Exclude logged-in user
      } catch (error) {
        console.error(" Error fetching users:", error);
      }
    };

    fetchUserList();

    // Start SignalR Connection
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      connection
        .start()
        .then(() => console.log(" Connected to SignalR"))
        .catch(err => console.error(" SignalR Connection Error:", err));
    }

    // Listen for incoming messages
    connection.on("ReceiveMessage", (sender, message) => {
      setMessages(prevMessages => [...prevMessages, { sender, message }]);
    });

    // Cleanup function on unmount
    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.stop().then(() => console.log("Disconnected from SignalR"));
      }
    };
  }, []);

  // Handles user selection for private chat
  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
  };

  // Handles sending messages
  const handleSendMessage = async () => {
    if (!message.trim()) {
      console.error("Cannot send empty message.");
      return;
    }

    // Determine payload for one-on-one or group chat
    const payload = {
      sender: user.UserId,
      message: message.trim(),
      receiverId: selectedUser, // Receiver for one-on-one chat
      roomId: null
    };

    if(payload.receiverId == ''){
      alert("select user to chat");
      return false;
    }

    console.log(" Sending message:", payload);

    try {
      await sendMessage(payload);
      setMessage(""); // Clear input on success
    } catch (error) {
      console.error(" Message send failed:", error);
    }
  };

  return (
    <div>
      <h2>Welcome, {user ? user.FullName : "Guest"}</h2>

      {/* User Selection for One-on-One Chat */}
      <h3>Select a User to Chat</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <button onClick={() => handleSelectUser(u.id)}>
              {u.fullName}
            </button>
          </li>
        ))}
      </ul>

      {/* Display selected chat target */}
      <h3>
        Chat with User {selectedUser}
      </h3>

      {/* Chat Messages */}
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>

      {/* Input Box for Sending Messages */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;