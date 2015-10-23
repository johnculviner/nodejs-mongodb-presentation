var mongoose = require('mongoose');

var widget = new mongoose.Schema({
  type: String
}, { strict: false });

var page = new mongoose.Schema({
  title: String,
  url: {
    type: String,
    required: true,
    validate: {
      validator: v => /.*\.com.+/.test(v),
      message: '{VALUE} must be a valid URL'
    }
  },
  widgets: [widget]
});

module.exports = mongoose.model('page', page);