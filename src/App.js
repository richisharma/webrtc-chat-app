import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";
import VideoCall from "./components/VideoCall";
import Register from "./components/Register";
import ChatRoomPage from "./components/ChatRoomPage";
import Features from "./components/Features";

const AppContent = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/video-call" element={<VideoCall/>} />
        <Route path="/chat-room" element={<ChatRoomPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;