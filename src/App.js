import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";
import VideoCall from "./components/VideoCall";
import Register from "./components/Register";
import GroupChat from "./components/GroupChat";

const AppContent = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/video-call" element={<VideoCall/>} />
        <Route path="/group-chat" element={<GroupChat />} />
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