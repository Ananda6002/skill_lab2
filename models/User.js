const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  numberOfOrders: { type: Number, default: 0 }
});
module.exports = mongoose.model('User', UserSchema);