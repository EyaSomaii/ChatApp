/** */
// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./Routes/userRoutes');
const roomRoutes = require('./Routes/roomRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const forumRoutes = require('./Routes/ForumRoutes');

const Message = require('./Models/Message');
const Forum = require('./Models/Forum');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your React app's URL
    credentials: true,               // Allow cookies to be sent cross-origin
  };
  
  app.use(cors(corsOptions));

const server = http.createServer(app);


// Middleware setup

app.use(express.json());

// MongoDB connection
// Connect To base mongodb 
mongoose.connect('mongodb+srv://eyasomai:0000@chatapp.kekwsyw.mongodb.net/chatApp', {
  
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
// End Connect To base mongodb 

// API routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/forum', forumRoutes);


// Socket.io connection
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

// Socket.io connection handling chat 
io.on('connection', (socket) => {
  //  console.log('New client connected');
  
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId); // Joining specific room for group chat
    });
  
    socket.on('sendMessage', async (data) => {
      // Save message to MongoDB
      const newMessage = new Message({
        roomId: data.roomId,
        sender: data.sender,
        message: data.message,
      });
      await newMessage.save();
  
      // Emit message to all users in the room
      io.to(data.roomId).emit('message', newMessage);
    });
  
    socket.on('disconnect', () => {
     // console.log('Client disconnected');
    });
  });



  
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
