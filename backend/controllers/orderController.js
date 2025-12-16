const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      restaurant,
      items,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      notes,
    } = req.body;

    // Validation
    if (!restaurant || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Verify restaurant exists
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      subtotal,
      deliveryFee: deliveryFee || restaurantExists.deliveryFee || 50,
      discount: discount || 0,
      totalAmount,
      estimatedDeliveryTime: restaurantExists.deliveryTime,
      notes: notes || '',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name logo deliveryTime')
      .populate('items.menuItem', 'name image');

    res.status(201).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message,
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name logo image deliveryTime')
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name logo image deliveryTime address')
      .populate('items.menuItem', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is order owner
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status || order.status;

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('restaurant', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};