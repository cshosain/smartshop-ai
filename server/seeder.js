import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

await connectDB();

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Automotive'];

const brands = {
  Electronics:    ['Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus'],
  Clothing:       ['Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s', 'Puma', 'Reebok', 'Gucci'],
  Books:          ['Penguin', 'HarperCollins', 'Oxford', 'Cambridge', 'Scholastic'],
  'Home & Kitchen':['IKEA', 'Philips', 'Bosch', 'KitchenAid', 'Cuisinart', 'Dyson'],
  Sports:         ['Nike', 'Adidas', 'Under Armour', 'Wilson', 'Spalding', 'Callaway'],
  Beauty:         ['L\'Oreal', 'Maybelline', 'MAC', 'NYX', 'Revlon', 'Clinique'],
  Toys:           ['LEGO', 'Mattel', 'Hasbro', 'Fisher-Price', 'Hot Wheels'],
  Automotive:     ['Bosch', '3M', 'Michelin', 'Meguiar\'s', 'Armor All'],
};

const productTemplates = {
  Electronics:    ['Wireless Headphones', 'Smart TV', 'Laptop', 'Smartphone', 'Tablet', 'Smartwatch', 'Bluetooth Speaker', 'Gaming Console', 'Camera', 'Monitor'],
  Clothing:       ['Running Shoes', 'Casual T-Shirt', 'Denim Jeans', 'Winter Jacket', 'Sports Shorts', 'Hoodie', 'Formal Shirt', 'Sneakers', 'Dress', 'Polo Shirt'],
  Books:          ['Python Programming', 'Machine Learning Guide', 'Business Strategy', 'Self Help Book', 'Fiction Novel', 'Science Textbook', 'History Book', 'Cookbook'],
  'Home & Kitchen':['Coffee Maker', 'Air Purifier', 'Vacuum Cleaner', 'Blender', 'Microwave', 'Toaster', 'Rice Cooker', 'Kettle', 'Iron', 'Fan'],
  Sports:         ['Yoga Mat', 'Dumbbell Set', 'Resistance Bands', 'Basketball', 'Tennis Racket', 'Football', 'Cycling Helmet', 'Swimming Goggles', 'Jump Rope'],
  Beauty:         ['Face Moisturizer', 'Lipstick', 'Foundation', 'Eye Shadow Palette', 'Perfume', 'Shampoo', 'Conditioner', 'Sunscreen', 'Serum'],
  Toys:           ['LEGO Set', 'Action Figure', 'Board Game', 'Remote Control Car', 'Puzzle', 'Stuffed Animal', 'Doll', 'Building Blocks'],
  Automotive:     ['Car Phone Mount', 'Dash Cam', 'Car Vacuum', 'Tire Inflator', 'Car Wax', 'Seat Cover', 'Jump Starter'],
};

const adjectives = ['Premium', 'Pro', 'Ultra', 'Elite', 'Advanced', 'Classic', 'Deluxe', 'Essential', 'Smart', 'Portable'];

const generateProducts = () => {
  const products = [];
  categories.forEach((category) => {
    const templates = productTemplates[category];
    const brandList = brands[category];
    // Generate enough products per category
    for (let i = 0; i < 65; i++) {
      const template  = templates[i % templates.length];
      const adj       = adjectives[Math.floor(Math.random() * adjectives.length)];
      const brand     = brandList[Math.floor(Math.random() * brandList.length)];
      const version   = Math.floor(Math.random() * 5) + 1;
      const price     = parseFloat((Math.random() * 490 + 10).toFixed(2));
      const stock     = Math.floor(Math.random() * 200) + 1;
      const ratings   = parseFloat((Math.random() * 2 + 3).toFixed(1));
      const numReviews= Math.floor(Math.random() * 500) + 1;

      products.push({
        name:        `${brand} ${adj} ${template} V${version}`,
        description: `The ${brand} ${adj} ${template} V${version} is a high-quality product in the ${category} category. It offers exceptional performance, durability, and value for money. Features include advanced technology, premium build quality, and user-friendly design. Perfect for both beginners and professionals.`,
        price,
        category,
        brand,
        stock,
        ratings,
        numReviews,
        isFeatured:  Math.random() > 0.85,
        tags:        [category.toLowerCase(), brand.toLowerCase(), template.toLowerCase(), adj.toLowerCase()],
        images:      [`https://picsum.photos/seed/${category}${i}/400/400`],
      });
    }
  });
  return products;
};

const seedDB = async () => {
  try {
    // Clear existing data before seeding to avoid duplicates.
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@smartshop.com',
      password: 'admin123456',
      role: 'admin',
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@smartshop.com',
      password: 'user123456',
      role: 'user',
    });

    const products = generateProducts();
    await Product.insertMany(products);

    console.log(`✅ Seeded ${products.length} products`);
    console.log('✅ Admin: admin@smartshop.com / admin123456');
    console.log('✅ User:  user@smartshop.com  / user123456');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();