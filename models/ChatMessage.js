const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  content: String,
  role: String,
  timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatSchema);

module.exports = ChatMessage;
