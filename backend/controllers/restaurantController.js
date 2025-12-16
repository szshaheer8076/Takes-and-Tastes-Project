const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
  try {
    const { category, search, popular } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    const restaurants = await Restaurant.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
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

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Get menu items for this restaurant
    const menuItems = await MenuItem.find({ restaurant: req.params.id });

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        menuItems,
      },
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

// @desc    Get menu items by restaurant
// @route   GET /api/restaurants/:id/menu
// @access  Public
exports.getRestaurantMenu = async (req, res) => {
  try {
    const { category } = req.query;

    let query = { restaurant: req.params.id };

    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query).populate(
      'restaurant',
      'name logo'
    );

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
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

// @desc    Get restaurant categories
// @route   GET /api/restaurants/categories/all
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { name: 'Fast Food', icon: '🍔' },
      { name: 'Chinese', icon: '🥡' },
      { name: 'Italian', icon: '🍝' },
      { name: 'Pakistani', icon: '🍛' },
      { name: 'BBQ', icon: '🍖' },
      { name: 'Desserts', icon: '🍰' },
      { name: 'Beverages', icon: '🥤' },
      { name: 'Healthy', icon: '🥗' },
      { name: 'Pizza', icon: '🍕' },
      { name: 'Burgers', icon: '🍔' },
    ];

    res.status(200).json({
      success: true,
      data: categories,
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

// @desc    Create restaurant (Admin only)
// @route   POST /api/restaurants
// @access  Private/Admin
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant,
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

// @desc    Create menu item (Admin only)
// @route   POST /api/restaurants/:id/menu
// @access  Private/Admin
exports.createMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const menuItem = await MenuItem.create({
      ...req.body,
      restaurant: req.params.id,
    });

    res.status(201).json({
      success: true,
      data: menuItem,
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