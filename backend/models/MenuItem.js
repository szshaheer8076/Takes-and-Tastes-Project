const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a menu item name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x200?text=Food',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Appetizers',
        'Main Course',
        'Desserts',
        'Beverages',
        'Sides',
        'Salads',
        'Soups',
        'Specials',
      ],
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);