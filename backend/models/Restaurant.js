const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a restaurant name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Restaurant',
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/150x150?text=Logo',
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    deliveryTime: {
      type: String,
      default: '30-40 min',
    },
    deliveryFee: {
      type: Number,
      default: 50,
    },
    minimumOrder: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        'Fast Food',
        'Chinese',
        'Italian',
        'Pakistani',
        'BBQ',
        'Desserts',
        'Beverages',
        'Healthy',
        'Pizza',
        'Burgers',
      ],
      default: 'Fast Food',
    },
    cuisineType: [String],
    isOpen: {
      type: Boolean,
      default: true,
    },
    address: {
      street: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    openingHours: {
      type: String,
      default: '10:00 AM - 11:00 PM',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
restaurantSchema.virtual('menuItems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'restaurant',
});

module.exports = mongoose.model('Restaurant', restaurantSchema);