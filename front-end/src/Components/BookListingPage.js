import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import './BookListingPage.css';
import Modal from 'react-modal';

// Set the app element for react-modal
Modal.setAppElement('#root');

function BookListingPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(6); 
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    // Fetch books from backend API
    fetch('http://localhost:5000/api/books')
      .then(response => response.json())
      .then(data => {
        console.log('Data received from API:', data);
        setBooks(data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []); // Only fetch once on component mount

  // Filter books based on search term and sort criteria
  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
    const sortedBooks = [...filtered].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else {
        return a[sortBy].localeCompare(b[sortBy]);
      }
    });

    setFilteredBooks(sortedBooks);
  }, [books, searchTerm, sortBy]); // Update filteredBooks when books, searchTerm, or sortBy change

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page when search term changes
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset page when sort criteria changes
  };

  // Handle books per page change
  const handleBooksPerPageChange = (e) => {
    setBooksPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset page when books per page changes
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="book-listing">
      <h1>Book Listing</h1>
      <div className="MenuBar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, author, or genre"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sorting">
          <label htmlFor="sortBy">Sort By:</label>
          <select id="sortBy" value={sortBy} onChange={handleSortChange}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="books-per-page">
          <label htmlFor="booksPerPage">Books Per Page:</label>
          <select id="booksPerPage" value={booksPerPage} onChange={handleBooksPerPageChange}>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>
      <div className="books-grid">
        {currentBooks.map(book => (
          <BookCard key={book.id} bookUniqueId={book._id} book={book} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "current-page" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookListingPage;
