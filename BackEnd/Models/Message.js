const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'PrivateRoom' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;