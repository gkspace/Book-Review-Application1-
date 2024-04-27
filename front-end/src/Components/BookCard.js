import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './BookCard.css';

// StarRating component to display gold stars based on rating
function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i}>&#9733;</span>); // Full star
    } else {
      stars.push(<span key={i}>&#9734;</span>); // Empty star
    }
  }
  return (
    <div className="star-rating">
      {stars} <span className="rating-value">{rating}</span>
    </div>
  );
}

function BookCard({ book , bookUniqueId}) {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isShowReviewModalOpen, setIsShowReviewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

 const [averageRating, setAverageRating] = useState(book.rating);

 useEffect(() => {
  if (isShowReviewModalOpen) {
    // Slice the reviews array to contain only the latest 5 reviews
    const latestReviews = book.reviews.slice(-5);
    setReviews(latestReviews);
  }
}, [isShowReviewModalOpen, book.reviews]);

useEffect(() => {
  // Calculate average rating
  console.log('reviews:', reviews);
  const totalRating = reviews.reduce((acc, review) => acc + Number(review.rating), 0);
  console.log('totalRating:', totalRating, 'reviews:', reviews.length);

  const avgRating = (totalRating / reviews.length || book.rating).toFixed(1);
  setAverageRating(Number(avgRating));
}, [reviews]);

  const openAddReviewModal = () => {
    setIsAddReviewModalOpen(true);
    // Reset form data when modal is opened
    setFormData({
      rating: 0,
      comment: ''
    });
  };

  const openShowReviewModal = () => {
    setIsShowReviewModalOpen(true);
  };
  
  const closeAddReviewModal = () => {
    setIsAddReviewModalOpen(false);
  };

  const closeShowReviewModal = () => {
    setIsShowReviewModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch(`http://localhost:5000/api/books/${bookUniqueId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Close the modal after submission
        closeAddReviewModal();
        // Show success message
        console.log('book id:', book.id);
        setSuccessMessage('Review submitted successfully!');
      } else {
        console.error('Failed to submit review:', response.statusText);
       
      }
    } catch (error) {
      console.error('Error submitting review:', error.message);
     
    }
  };
  
  

  return (
    <div className="book-card">
      <img src={book.coverUrl} alt={book.title} />
      <div className="details">
        <h2>{book.title}</h2>
        <div className="rating-container">
          <StarRating rating={averageRating} />
        </div>
        <p>Author: {book.author}</p>
        <p>Genre: {book.genre}</p>
      </div>

      <button onClick={openAddReviewModal}>Add Review</button>
      <button onClick={openShowReviewModal}>Show Reviews</button>
      
      <Modal
        isOpen={isAddReviewModalOpen}
        onRequestClose={closeAddReviewModal}
        contentLabel="Add Review"
        className="review-modal"
      >
        <h2>Add Review</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </label>
          <label>
            Comment:
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Submit Review</button>
        </form>
        <button onClick={closeAddReviewModal}>Cancel</button>
      </Modal>
      
      <Modal
        isOpen={isShowReviewModalOpen}
        onRequestClose={closeShowReviewModal}
        contentLabel="Show Reviews"
        className="review-modal"
      >
        <div>
          <h2>{book.title}</h2>
          <p>Author: {book.author}</p>
          <p>Description: {book.description}</p>
        </div>
        <div>
          <h3>Reviews for {book.title}:</h3>
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <p className="comment">{review.comment}</p>
              <StarRating className="rating" rating={review.rating} />
            </div>
          ))}
        </div>
        <button onClick={closeShowReviewModal}>Close</button>
      </Modal>
    </div>
  );
}

export default BookCard;
