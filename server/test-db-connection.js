require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('');

const uri = process.env.MONGODB_URI || '';
if (!uri) {
  console.log('❌ ERROR: MONGODB_URI not found in .env file');
  process.exit(1);
}

const maskedUri = uri.replace(/:[^:@]+@/, ':****@');
console.log('Connection String:', maskedUri);
console.log('');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then((conn) => {
  console.log('✅ SUCCESS: Database Connected!');
  console.log('  - Host:', conn.connection.host);
  console.log('  - Database:', conn.connection.name);
  console.log('  - Ready State: Connected');
  mongoose.connection.close();
  process.exit(0);
})
.catch((error) => {
  console.log('❌ FAILED: Database Connection Failed!');
  console.log('Error:', error.message);
  process.exit(1);
});













