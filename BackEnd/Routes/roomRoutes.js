// routes/roomRoutes.js
const express = require('express');
const { createRoom, getUserRooms } = require('../Controllers/roomController');

const router = express.Router();

router.post('/create/:userId', createRoom);
router.get('/:userId', getUserRooms);

module.exports = router;
