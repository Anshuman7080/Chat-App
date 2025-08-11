const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
        type: String,
        required: [true, "please enter group name"]
    },
  members: [{
     type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
           }],
 admin: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:[true,"please Select the admin"]
    },
   profile_pic: {
        type: String,
        default: ""
    },
    conversation:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"GroupMessage",
    
    }

} ,
 {
    timestamps: true
});

module.exports = mongoose.model("Group", GroupSchema);