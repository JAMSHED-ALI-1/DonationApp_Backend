const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  firstName: { type: String, },
  lastName: { type: String, },
  address1: { type: String,  },
  address2: { type: String },
  city: { type: String,  },
  state: { type: String,  },
  zip: { type: String,  },
  email: { type: String,  },
  phone: { type: String,  },
  donation: [
    {
      amount: { type: String, required:true},
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);