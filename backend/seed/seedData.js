const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks and 8K DPI track-on-glass sensor ergonomic wireless mouse with MagSpeed scrolling and USB-C quick charge.',
    price: 8995.00,
    category: 'Electronics',
    quantity: 34,
    sku: 'PRD-LGT01',
    status: 'In Stock',
  },
  {
    name: 'Apple MacBook Pro 14" M3 Pro',
    description: 'Supercharged by M3 Pro chip with 18GB Unified Memory, 512GB SSD and Liquid Retina XDR display.',
    price: 199900.00,
    category: 'Electronics',
    quantity: 12,
    sku: 'PRD-APL02',
    status: 'In Stock',
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality.',
    price: 29990.00,
    category: 'Electronics',
    quantity: 18,
    sku: 'PRD-SNY03',
    status: 'In Stock',
  },
  {
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
    description: 'Brilliant IPS Black technology with 4K resolution, 98% DCI-P3 color gamut, and 90W Power Delivery.',
    price: 54999.00,
    category: 'Electronics',
    quantity: 8,
    sku: 'PRD-DEL04',
    status: 'In Stock',
  },
  {
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    description: 'Full aluminum body, hot-swappable QMK/VIA programmable mechanical keyboard with double-gasket design.',
    price: 18499.00,
    category: 'Electronics',
    quantity: 4, // Low Stock demo
    sku: 'PRD-KCH05',
    status: 'Low Stock',
  },
  {
    name: 'Herman Miller Aeron Ergonomic Chair',
    description: 'Iconic ergonomic mesh office chair offering superior lumbar posture fit and breathable pellicle material.',
    price: 125000.00,
    category: 'Office Furniture',
    quantity: 6,
    sku: 'PRD-HMA06',
    status: 'In Stock',
  },
  {
    name: 'Fully Jarvis Bamboo Standing Desk',
    description: 'Motorized height adjustable sit-to-stand desk with dual motors, solid sustainable bamboo top.',
    price: 64500.00,
    category: 'Office Furniture',
    quantity: 3, // Low Stock demo
    sku: 'PRD-JAR07',
    status: 'Low Stock',
  },
  {
    name: 'Ember Temperature Control Smart Mug 2',
    description: 'App-controlled smart heated mug keeps your coffee or tea at your precise drinking temperature for 80 minutes.',
    price: 12999.00,
    category: 'Home & Kitchen',
    quantity: 22,
    sku: 'PRD-EMB08',
    status: 'In Stock',
  },
  {
    name: 'Breville Barista Touch Espresso Machine',
    description: 'Automated touchscreen espresso machine with integrated conical burr grinder and automatic microfoam milk texturing.',
    price: 89999.00,
    category: 'Home & Kitchen',
    quantity: 0, // Out of Stock demo
    sku: 'PRD-BRV09',
    status: 'Out of Stock',
  },
  {
    name: 'Patagonia Nano Puff Insulated Jacket',
    description: 'Warm, windproof, water-resistant lightweight jacket using 60g PrimaLoft Gold Insulation Eco.',
    price: 21500.00,
    category: 'Clothing',
    quantity: 19,
    sku: 'PRD-PAT10',
    status: 'In Stock',
  },
  {
    name: 'Nike Air Zoom Pegasus 40 Running Shoes',
    description: 'Springy ride for every run, energized with Nike React technology and Zoom Air units in the forefoot.',
    price: 11895.00,
    category: 'Sports & Outdoors',
    quantity: 15,
    sku: 'PRD-NIK11',
    status: 'In Stock',
  },
  {
    name: 'Designing Data-Intensive Applications',
    description: 'The definitive guide to the architecture of modern data storage, processing systems by Martin Kleppmann.',
    price: 3450.00,
    category: 'Books',
    quantity: 28,
    sku: 'PRD-BK012',
    status: 'In Stock',
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_management_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log(`Inserting ${sampleProducts.length} sample products with INR prices...`);
    await Product.insertMany(sampleProducts);

    console.log('Data successfully seeded into MongoDB with Indian Rupee amounts!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
