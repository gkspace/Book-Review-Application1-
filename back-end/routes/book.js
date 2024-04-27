const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

//const uri = 'mongodb://localhost:27017'; // MongoDB connection URI
const uri = 'mongodb+srv://ramanathan1110:liLlR5Fq1s19CCrc@cluster0.yjhmrq2.mongodb.net';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getBooksFromDB() {
  try {
    const db = client.db('library'); 
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
  } catch (err) {
    console.error('Error getting books from MongoDB:', err);
    return [];
  }
}
async function getBookById(bookId) {
  try {
    const db = client.db('library'); 
    const collection = db.collection('books');
    const book = await collection.findOne({ _id: new ObjectId(bookId) }); // Use new keyword
    return book;
  } catch (err) {
    console.error('Error getting book by ID:', err);
    return null;
  }
}

async function getReviewsByBookId(bookId) {
  try {
    const db = client.db('library'); 
    const collection = db.collection('books');
    const book = await collection.findOne({ _id: new ObjectId(bookId) }); // Use new keyword
    if (book) {
      return book.reviews;
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error getting reviews by book ID:', err);
    return [];
  }
}


router.get('/', async (req, res) => {
  try {
    const books = await getBooksFromDB();
    res.json(books);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookById(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getReviewsByBookId(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const review = req.body;
    const db = client.db('library');
    const collection = db.collection('books');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: review } }
    );
    if (result.matchedCount > 0) {
      res.status(201).send('Review added successfully');
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;
