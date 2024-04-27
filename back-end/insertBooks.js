const mongoose = require('mongoose');

// Define the schema for the book document
const bookSchema = new mongoose.Schema({
  id: Number,
  title: String,
  author: String,
  description: String,
  coverUrl: String,
  genre: String,
  rating: Number,
  reviews: [{
    user: String,
    comment: String,
    rating: Number
  }]
});

// Create a model for the book collection
const Book = mongoose.model('Book', bookSchema);

// MongoDB Atlas connection string
//const urilocal = 'mongodb://localhost:27017/library'
const uri = 'mongodb+srv://ramanathan1110:liLlR5Fq1s19CCrc@cluster0.yjhmrq2.mongodb.net/library';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    const mockReviews = [
      { user: 'User1', comment: 'Great book!', rating: 5 },
      { user: 'User2', comment: 'Enjoyed reading it.', rating: 4 },
      { user: 'User3', comment: 'Amazing!', rating: 5 },
      { user: 'User4', comment: 'Highly recommended.', rating: 5 },
      { user: 'User5', comment: 'Scary portrayal of a dystopian society.', rating: 4 },
      { user: 'User6', comment: 'Thought-provoking.', rating: 3 },
      { user: 'User7', comment: 'Could not put it down!', rating: 4 },
      { user: 'User8', comment: 'A must-read for everyone.', rating: 4 },
      { user: 'User9', comment: 'Captivating from start to finish.', rating: 3 },
      { user: 'User10', comment: 'One of my favorites!', rating: 4 },
      { user: 'User11', comment: 'Beautifully written.', rating: 4 },
      { user: 'User12', comment: 'A timeless classic.', rating: 3 },
      { user: 'User13', comment: 'Captured my imagination.', rating: 4 },
      { user: 'User14', comment: 'Loved every page of it.', rating: 3 }
    ];

    // Insert the books into the collection
    const booksData = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A classic novel about the American Dream', coverUrl: 'https://m.media-amazon.com/images/I/71V1cA2fiZL._AC_UF1000,1000_QL80_.jpg', genre: 'Classic', reviews: mockReviews.slice(0, 3) },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', description: 'A powerful story of racial injustice and moral growth', coverUrl: 'https://m.media-amazon.com/images/I/41j-s9fHJcL.jpg', genre: 'Fiction', reviews: mockReviews.slice(3, 6) },
      { id: 3, title: '1984', author: 'George Orwell', description: 'A dystopian novel exploring totalitarianism and surveillance', coverUrl: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/book/m/c/5/-original-imagqtdt7tnzf8dk.jpeg?q=90&crop=false', genre: 'Dystopian', reviews: mockReviews.slice(6, 9) },
      { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', description: 'A romantic novel of manners set in early 19th-century England', coverUrl: 'https://images.squarespace-cdn.com/content/v1/58c180edff7c50dd0e51a2ad/1596041993633-UW2GTN4JZP8XLPZKKXCJ/9781847493699.jpg', genre: 'Romance', reviews: mockReviews.slice(9, 12) },
      { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', description: 'A story about teenage angst and alienation', coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg/640px-The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg', genre: 'Coming-of-age', reviews: mockReviews.slice(12, 15) },
      { id: 6, title: 'Moby-Dick', author: 'Herman Melville', description: 'A novel about Captain Ahab and his quest for revenge on the white whale', coverUrl: 'https://m.media-amazon.com/images/I/81R91ODA9DL._AC_UF1000,1000_QL80_.jpg', genre: 'Adventure', reviews: mockReviews.slice(0, 3) },
      { id: 7, title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', description: 'The first book in the Harry Potter series', coverUrl: 'https://m.media-amazon.com/images/I/81YOuOGFCJL.jpg', genre: 'Fantasy', reviews: mockReviews.slice(3, 6) },
      { id: 8, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', description: 'An epic high-fantasy novel', coverUrl: 'https://m.media-amazon.com/images/I/71VjmMcE-rL._AC_UF1000,1000_QL80_.jpg', genre: 'Fantasy', reviews: mockReviews.slice(6, 9) }
    ];

  const booksWithAvgRating = booksData.map(bookData => {
  const sumOfRatings = bookData.reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = (sumOfRatings / bookData.reviews.length).toFixed(1);
  return { ...bookData, rating: parseFloat(avgRating) };
});

    Book.insertMany(booksWithAvgRating)
      .then((result) => {
        console.log(`${result.length} books inserted`);
      })
      .catch((err) => {
        console.error('Error inserting books:', err);
      })
      .finally(() => {
        // Disconnect from MongoDB after insertion
        mongoose.disconnect();
      });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
