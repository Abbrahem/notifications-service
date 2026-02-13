const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connectDB() {
  if (db) return db;

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('✅ MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

module.exports = { connectDB, getDB };
