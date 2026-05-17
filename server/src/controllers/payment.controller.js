const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');

const createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
      orderId: `ORD-${Date.now()}`,
      userId: req.user.id,
      items,
      totalAmount,
      paymentMethod,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.user.id })
      .populate('items.songId')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('items.songId');

    if (!order) {
      return next(ApiError.notFound('Order not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return next(ApiError.notFound('Order not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
};
