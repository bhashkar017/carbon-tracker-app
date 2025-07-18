const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  goals: {
    monthlyFootprintGoal: { type: Number, default: 100 } // e.g., kg CO2
  }
});

module.exports = mongoose.model('User', UserSchema);