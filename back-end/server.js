// server.js

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB Connection URI
//const uri = 'mongodb://localhost:27017';
const uri ='mongodb+srv://ramanathan1110:liLlR5Fq1s19CCrc@cluster0.yjhmrq2.mongodb.net/'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDB();

// Routes
const booksRouter = require('./routes/book');
app.use('/api/books', booksRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
