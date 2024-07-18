// routes/userRoutes.js
const express = require('express');
const { FindAllUsers,loginUser,GetUserById } = require('../Controllers/userController');

const router = express.Router();


router.post('/login', loginUser);
router.get('/findAllUser/:userId', FindAllUsers);
router.get('/getUser/:userId', GetUserById);



module.exports = router;
