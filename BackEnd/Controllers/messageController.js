// controllers/messageController.js
const Message = require('../models/Message');

const getMessages = async (req, res) => {
    const roomId = req.params.roomId;

    try {
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 }).populate('sender', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMessages };
