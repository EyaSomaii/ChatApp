// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import ChatInterface from "./components/ChatInterface";
import Chatsapp from "./components/Chatsapp";



const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/ChatRoom" element={<ChatRoom />} />
      <Route path="/ChatInterface" element={<ChatInterface />} />
      <Route path="/Chatsapp" element={<Chatsapp />} />


      </Routes>
    </Router>
  );
};

export default App;
