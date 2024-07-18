// routes/messageRoutes.js
const express = require('express');
const { getMessages } = require('../Controllers/messageController');

const router = express.Router();

router.get('/:roomId', getMessages);

module.exports = router;
