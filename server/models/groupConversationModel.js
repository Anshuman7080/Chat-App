const mongoose = require('mongoose');

const GroupConversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  group:{
           type: mongoose.Schema.Types.ObjectId,
          ref: 'Group',
  }
},{
  timestamps:true
});

module.exports = mongoose.model("GroupMessage", GroupConversationSchema);