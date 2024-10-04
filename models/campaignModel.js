const mongoose = require('mongoose');

const CompainSchema = new mongoose.Schema({
    author: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    urlToImage: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
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
        type: Number
    },
    addToSlider: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notifyUser: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },

    // New fields for Donation/Fundraising feature
    donationGoal: {
        type: Number,  // Represents the donation goal, e.g., $10,000
        required: true
    },
    donationReceived: {
        type: Number,  // Total amount of donations received
        default: 0
    },
    donationCurrency: {
        type: String,  // e.g., USD, EUR
        default: 'USD'
    },
    fundRaisingStartDate: {
        type: Date,  // The date when the fundraising starts
        required: true
    },
    fundRaisingEndDate: {
        type: Date,  // The date when the fundraising ends
        required: true
    },
    donors: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: {
            type: Number,  // Amount donated by the user
            required: true
        },
        donatedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Campaign', CompainSchema);
