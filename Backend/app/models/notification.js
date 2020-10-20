const mongoose = require('mongoose');
let Schema = mongoose.Schema

/* Schema for notification model */
let notificationSchema = new Schema({
  notificationId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: ''
  },
  notificationIssueId:{
    type: String,
    default: ''
  },
  notificationIssueNumber:{
    type: Number
  },
  receiverUserId:{
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: '' 
  },
  dateTime: {
    type: Date,
    default: ''
  }
});

mongoose.model('Notification', notificationSchema);