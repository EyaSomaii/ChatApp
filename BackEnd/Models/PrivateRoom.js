const mongoose = require('mongoose');

const privateRoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const PrivateRoom = mongoose.model('PrivateRoom', privateRoomSchema);

module.exports = PrivateRoom;