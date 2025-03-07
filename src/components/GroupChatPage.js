import React, { useState } from "react";
import CreateChatRoom from "./CreateChatRoom";
import GroupChat from "./GroupChat";

const GroupChatPage = () => {
  // State to hold the currently selected/created room
  const [currentRoom, setCurrentRoom] = useState(null);

  // Callback to be passed to CreateChatRoom when a room is created
  const handleRoomCreated = (room) => {
    console.log("Room created:", room);
    setCurrentRoom(room);
  };

  return (
    <div>
      <h2>Group Chat</h2>
      {/* If no room has been created/selected, show the CreateChatRoom component */}
      {!currentRoom ? (
        <CreateChatRoom onRoomCreated={handleRoomCreated} />
      ) : (
        // Once a room is created, load the group chat interface.
        <GroupChat roomId={currentRoom.RoomId || currentRoom.roomId} />
      )}
    </div>
  );
};

export default GroupChatPage;