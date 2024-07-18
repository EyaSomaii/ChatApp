// controllers/messageController.js
const { default: mongoose } = require('mongoose');
const Forum = require('../models/Forum');

const getMessages = async (req, res) => {
 

    try {
        const messages = await Forum.find().populate('sender', 'username');
    
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const sendMessages = async (req, res) => {
    const { sender, content } = req.body;
  
   
  
   
      const newMessage = new Forum({
        sender,
        content,
      });
  
      const savedMessage = await newMessage.save();
      res.status(201).json(savedMessage);
   
  };
module.exports = { getMessages,sendMessages };
