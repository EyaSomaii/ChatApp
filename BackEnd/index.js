const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const port = 3000;
// Connect To base mongodb 
mongoose.connect('mongodb+srv://eyasomai:0000@chatapp.kekwsyw.mongodb.net/chatApp', {
  
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
// End Connect To base mongodb 



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});