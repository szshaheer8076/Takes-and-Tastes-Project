const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  getRestaurantMenu,
  getCategories,
  createRestaurant,
  createMenuItem,
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getRestaurants);
router.get('/categories/all', getCategories);
router.get('/:id', getRestaurant);
router.get('/:id/menu', getRestaurantMenu);

// Admin routes
router.post('/', protect, admin, createRestaurant);
router.post('/:id/menu', protect, admin, createMenuItem);

module.exports = router;