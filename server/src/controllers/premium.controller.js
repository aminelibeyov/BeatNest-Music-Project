const PremiumSubscription = require('../models/PremiumSubscription');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const createSubscription = async (req, res, next) => {
  try {
    const { plan, paymentMethod } = req.body;

    if (!['premium', 'premium_family'].includes(plan)) {
      return next(ApiError.badRequest('Invalid plan'));
    }

    let subscription = await PremiumSubscription.findOne({ userId: req.user.id });

    if (!subscription) {
      subscription = new PremiumSubscription({
        userId: req.user.id,
        plan,
        paymentMethod,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      if (plan === 'premium') {
        subscription.features.offlineDownload = true;
        subscription.features.noAds = true;
        subscription.features.highQuality = true;
        subscription.features.unlimitedSkips = true;
      }

      if (plan === 'premium_family') {
        subscription.features.offlineDownload = true;
        subscription.features.noAds = true;
        subscription.features.highQuality = true;
        subscription.features.unlimitedSkips = true;
      }
    } else {
      subscription.plan = plan;
      subscription.paymentMethod = paymentMethod;
      subscription.isActive = true;
      subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Premium subscription activated',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

const getSubscription = async (req, res, next) => {
  try {
    const subscription = await PremiumSubscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: 'No subscription found',
        data: { plan: 'free', isActive: false }
      });
    }

    // Check if subscription expired
    if (subscription.endDate < new Date() && subscription.autoRenew === false) {
      subscription.isActive = false;
      await subscription.save();
    }

    res.status(200).json({
      success: true,
      message: 'Subscription fetched successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await PremiumSubscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return next(ApiError.notFound('Subscription not found'));
    }

    subscription.isActive = false;
    subscription.autoRenew = false;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

const checkPremiumStatus = async (req, res, next) => {
  try {
    const subscription = await PremiumSubscription.findOne({ userId: req.user.id });

    if (!subscription || !subscription.isActive || subscription.endDate < new Date()) {
      return res.status(200).json({
        success: true,
        data: {
          isPremium: false,
          plan: 'free',
          features: {
            offlineDownload: false,
            noAds: false,
            highQuality: false,
            unlimitedSkips: false
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isPremium: true,
        plan: subscription.plan,
        features: subscription.features,
        endDate: subscription.endDate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscription,
  getSubscription,
  cancelSubscription,
  checkPremiumStatus
};
