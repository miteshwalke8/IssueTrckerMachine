const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/issueTrackerDB1");
autoIncrement.initialize(connection);

const Issue = new Schema({
  issueId: {
    type: String,
    unique: true,
    required: true,
    default: ''
  },
  title: {
    type: String,
  
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  issueType: {
    type: String,
  
    default: ''
  },
  description: {
    type: String,
   
    default: ''
  },
  priority: {
    type: String,
 
    default: '',
  },
  reporterUserId: {
    type: String,
    default: '',
  },
  assigneeUserId: {
    type: String,
    default: ''
  },
  reporterName: {
    type: String,
    default: '',
  },
  assigneeName: {
    type: String,
    default: ''
  },
  attachments: [],
  estimate: {
    type: String,
    default: ''
  },
  createdDate: {
    type: Date,
    default: ''
  },
  lastUpdatedDate:{
    type: Date,
    default: ''
  },
  lastUpdatedBy:{
    type: String,
    default: '',
  },
  watchers: [],
  comments:[]
});

Issue.plugin(autoIncrement.plugin, { model: 'Issue', field: 'issueNumber' });

module.exports = mongoose.model('Issue', Issue);