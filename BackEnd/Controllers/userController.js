const User = require('../Models/User');
const jwt = require('jsonwebtoken');

exports.FindAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    const users = await User.find({ _id: { $ne: loggedInUserId } });
        res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

exports.GetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && user.password===password) {
      
      const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '30d' });

      res.json({
        _id: user._id,
        username: user.username,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
