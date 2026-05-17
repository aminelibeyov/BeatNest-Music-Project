const mongoose = require('mongoose');

const premiumSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'premium_family'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'stripe'],
    default: null
  },
  features: {
    offlineDownload: {
      type: Boolean,
      default: false
    },
    noAds: {
      type: Boolean,
      default: false
    },
    highQuality: {
      type: Boolean,
      default: false
    },
    unlimitedSkips: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('PremiumSubscription', premiumSubscriptionSchema);
