import React, { useState } from "react";
import axios from "axios";

const CreateChatRoom = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError("Room name is required.");
      return;
    }

    const API_URL = `${process.env.REACT_APP_MESSAGING_SERVICE_URL}/api/chatrooms/create`;
    const payload = { roomName, description };

    try {
      console.log("Creating room with payload:", payload);
      const response = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Room created:", response.data);
      onRoomCreated(response.data); // Callback to update parent component if needed
    } catch (err) {
      console.error("Error creating room:", err.response?.data || err);
      setError("Error creating room. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create Chat Room</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateChatRoom;