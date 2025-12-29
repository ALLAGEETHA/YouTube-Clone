import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI ? 'Set (hidden)' : 'NOT SET');

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-clone')
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:');
    console.error('Error message:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check if MongoDB is running (local) or accessible (Atlas)');
    console.error('2. Verify MONGODB_URI in .env file');
    console.error('3. For Atlas: Check IP whitelist and credentials');
    process.exit(1);
  });

