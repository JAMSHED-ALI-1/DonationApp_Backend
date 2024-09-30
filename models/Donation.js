const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  donation: [
    {
      amount: { type: Number, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
    required: true,
  },
});

module.exports = mongoose.model('Donation', donationSchema);
