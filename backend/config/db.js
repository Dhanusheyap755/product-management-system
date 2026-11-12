const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS querySrv ECONNREFUSED when resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('[DNS Warning]: Could not set custom DNS servers', e.message);
}

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      uri = 'mongodb+srv://testuser:dhanudsd@cluster0.pimkevk.mongodb.net/product_management_db?retryWrites=true&w=majority';
    }

    const conn = await mongoose.connect(uri, {
      dbName: 'product_management_db',
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
