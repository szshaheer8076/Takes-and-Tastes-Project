const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    // Create restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Pizza Paradise',
        description: 'Best pizzas in town with fresh ingredients',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        logo: 'https://via.placeholder.com/150x150?text=PP',
        rating: 4.5,
        deliveryTime: '30-40 min',
        deliveryFee: 50,
        category: 'Pizza',
        isPopular: true,
        discount: 15,
      },
      {
        name: 'Burger House',
        description: 'Juicy burgers and crispy fries',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
        logo: 'https://via.placeholder.com/150x150?text=BH',
        rating: 4.3,
        deliveryTime: '25-35 min',
        deliveryFee: 40,
        category: 'Burgers',
        isPopular: true,
      },
      {
        name: 'Desi Delights',
        description: 'Authentic Pakistani cuisine',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
        logo: 'https://via.placeholder.com/150x150?text=DD',
        rating: 4.7,
        deliveryTime: '40-50 min',
        deliveryFee: 60,
        category: 'Pakistani',
        isPopular: true,
        discount: 10,
      },
    ]);

    // Create menu items
    const menuItems = [];
    
    // Pizza Paradise Menu
    menuItems.push(
      {
        restaurant: restaurants[0]._id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 899,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        category: 'Main Course',
        isVegetarian: true,
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni and extra cheese',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        category: 'Main Course',
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Garlic Bread',
        description: 'Crispy garlic bread with herb butter',
        price: 299,
        image: 'https://images.unsplash.com/photo-1573140401552-388e7c3e5e2d',
        category: 'Sides',
        isVegetarian: true,
      }
    );

    // Burger House Menu
    menuItems.push(
      {
        restaurant: restaurants[1]._id,
        name: 'Classic Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, and special sauce',
        price: 599,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        category: 'Main Course',
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Chicken Burger',
        description: 'Crispy chicken with mayo and pickles',
        price: 549,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086',
        category: 'Main Course',
      },
      {
        restaurant: restaurants[1]._id,
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 199,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877',
        category: 'Sides',
        isVegetarian: true,
      }
    );

    // Desi Delights Menu
    menuItems.push(
      {
        restaurant: restaurants[2]._id,
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken',
        price: 450,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
        category: 'Main Course',
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Seekh Kabab',
        description: 'Grilled minced meat kebabs with spices',
        price: 380,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
        category: 'Appetizers',
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Gulab Jamun',
        description: 'Sweet dumplings in sugar syrup',
        price: 150,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc',
        category: 'Desserts',
        isVegetarian: true,
      }
    );

    await MenuItem.insertMany(menuItems);

    console.log('✅ Database seeded successfully!');
    console.log(`✅ Created ${restaurants.length} restaurants`);
    console.log(`✅ Created ${menuItems.length} menu items`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();