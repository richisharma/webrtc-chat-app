import React, { useState } from "react";
import CreateChatRoom from "./CreateChatRoom";
import ChatRoom from "./ChatRoom";

const ChatRoomPage = () => {
  // State to hold the currently selected/created room
  const [currentRoom, setCurrentRoom] = useState(null);

  // Callback to be passed to CreateChatRoom when a room is created
  const handleRoomCreated = (room) => {
    console.log("Room created:", room);
    setCurrentRoom(room);
  };

  return (
    <div>
      <h2>Chat Room</h2>
      {/* If no room has been created/selected, show the CreateChatRoom component */}
      {!currentRoom ? (
        <CreateChatRoom onRoomCreated={handleRoomCreated} />
      ) : (
        // Once a room is created, load the group chat interface.
        <ChatRoom roomId={currentRoom.RoomId || currentRoom.roomId} />
      )}
    </div>
  );
};

export default ChatRoomPage;