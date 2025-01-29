import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddReviewForm from './AddReviewForm';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({ title: '', author: '', genre: '' });

  useEffect(() => {
    fetch(`http://localhost:5000/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
        setReviews(data.reviews || []);
        setUpdatedBook({ title: data.title, author: data.author, genre: data.genre });
      })
      .catch((error) => console.error('Error fetching book details:', error));
  }, [id]);

  // UPDATE book details
  const handleUpdateBook = (event) => {
    event.preventDefault();
    fetch(`http://localhost:5000/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBook),
    })
      .then((response) => response.json())
      .then((updatedBook) => {
        setBook(updatedBook);
        setEditMode(false);
      })
      .catch((error) => console.error('Error updating book:', error));
  };

  // DELETE book
  const handleDeleteBook = () => {
    fetch(`http://localhost:5000/books/${id}`, { method: 'DELETE' })
      .then(() => navigate('/'))
      .catch((error) => console.error('Error deleting book:', error));
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>

      <button onClick={() => setEditMode(!editMode)}>Update Book</button>
      <button onClick={handleDeleteBook} style={{ marginLeft: '10px', color: 'red' }}>Delete Book</button>

      {editMode && (
        <form onSubmit={handleUpdateBook}>
          <input
            type="text"
            value={updatedBook.title}
            onChange={(e) => setUpdatedBook({ ...updatedBook, title: e.target.value })}
          />
          <input
            type="text"
            value={updatedBook.author}
            onChange={(e) => setUpdatedBook({ ...updatedBook, author: e.target.value })}
          />
          <input
            type="text"
            value={updatedBook.genre}
            onChange={(e) => setUpdatedBook({ ...updatedBook, genre: e.target.value })}
          />
          <button type="submit">Save Changes</button>
        </form>
      )}

      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>{review.content}</p>
              <p>Rating: {review.rating} / 5</p>
              <p>By: {review.user.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      <h2>Add a Review</h2>
      <AddReviewForm bookId={id} setReviews={setReviews} />
    </div>
  );
};

export default BookDetails;
