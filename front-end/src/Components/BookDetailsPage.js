import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetailsPage.css';

function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    // Fetch book details from backend API
    fetch(`http://localhost:5000/api/books/${id}`)
      .then(response => response.json())
      .then(data =>{
        console.log('Data received from API:', data);
        setBook(data)}
      )
      .catch(error => console.error('Error fetching book details:', error));
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-details">
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Description: {book.description}</p>
      {/* Add reviews component here */}
    </div>
  );
}

export default BookDetailsPage;
