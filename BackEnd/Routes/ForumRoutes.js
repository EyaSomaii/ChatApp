// routes/messageRoutes.js
const express = require('express');
const { getMessages ,sendMessages} = require('../Controllers/ForumController');

const router = express.Router();

router.get('/getAllMessages', getMessages);
router.post('/sendMessage', sendMessages);

module.exports = router;
