const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    author: {
        type: String,
        // required: true
    },
    title: {
        type: String,
        // required: true
    },
    content: {
        type: String,
        // required: true
    },
    url: {
        type: String
    },
    image_url: {
        type: String,
        // required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        // required: true  // Ensures category is always provided
    },
    views: {
        type: Number,
        default: 0
    },
    timeToRead: {
        type: String
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: String
    }],
    like: {
        type: Number,
        default: 0
    },
    addToSlider: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true  // Ensures addedBy is always provided
    },
    notifyUser: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date,
        default: Date.now  // Default to the current date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

    // New fields for Donation/Fundraising feature
    donationGoal: {
        type: Number,
        // required: true
    },
    donationReceived: {
        type: Number,
        default: 0
    },
    donationCurrency: {
        type: String,
        default: 'USD'
    },
    fundRaisingStartDate: {
        type: String,
        // required: true
    },
    fundRaisingEndDate: {
        type: String,
        // required: true
    },
    created_at: { type: Date, default: Date.now },
    donors: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: {
            type: Number,
            // required: true
        },
        donatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    // timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('Campaign', CampaignSchema);
