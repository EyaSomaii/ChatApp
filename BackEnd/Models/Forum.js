const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
   
    sender: {type: String },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Forum = mongoose.models.Forum || mongoose.model('Forum', ForumSchema);

module.exports = Forum;