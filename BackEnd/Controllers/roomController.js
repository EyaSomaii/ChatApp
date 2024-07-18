// controllers/roomController.js
const PrivateRoom = require("../models/PrivateRoom");
const User = require("../models/User");

const createRoom = async (req, res) => {
  const { roomName, memberIds, admin } = req.body;

  try {
    const members = await User.find({ _id: { $in: memberIds } });

    const admin = await User.findById(req.params.userId);
    members.push(admin);
    console.log(members);
    const room = new PrivateRoom({ roomName, members, admin });
    await room.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserRooms = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rooms = await PrivateRoom.find({ members: userId }).populate('members', 'username');
    
    res.json(rooms);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createRoom, getUserRooms };
