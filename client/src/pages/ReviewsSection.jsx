import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  // Fetch all reviews
  useEffect(() => {
    fetch("http://localhost:5000/reviews")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Fetch all books
  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // Handle Add/Update Review
  const handleSubmit = (values, { resetForm }) => {
    const method = editingReview ? "PUT" : "POST";
    const url = editingReview
      ? `http://localhost:5000/reviews/${editingReview.id}`
      : "http://localhost:5000/reviews";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editingReview) {
          setReviews(
            reviews.map((review) => (review.id === data.id ? data : review))
          );
          alert("Review updated successfully!");
        } else {
          setReviews([...reviews, data]);
          alert("Review added successfully!");
        }
        resetForm();
        setEditingReview(null);
      })
      .catch((error) => console.error("Error saving review:", error));
  };

  // Handle Delete Review
  const handleDeleteReview = (id) => {
    fetch(`http://localhost:5000/reviews/${id}`, { method: "DELETE" })
      .then(() => {
        setReviews(reviews.filter((review) => review.id !== id));
        alert("Review deleted successfully!");
      })
      .catch((error) => console.error("Error deleting review:", error));
  };

  // Validation schema for the form
  const validationSchema = Yup.object({
    content: Yup.string().required("Review content is required"),
    rating: Yup.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .required("Rating is required"),
    user_id: Yup.string().required("User selection is required"),
    book_id: Yup.string().required("Book selection is required"),
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Manage Reviews</h1>

      {/* List of Reviews */}
      {reviews.length > 0 ? (
        <div style={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <h3 style={styles.bookTitle}>{review.book?.title || "Unknown Book"}</h3>
              <p style={styles.reviewContent}>{review.content}</p>
              <p style={styles.rating}>⭐ {review.rating} / 5</p>
              <p style={styles.user}>By: {review.user?.name || "Unknown User"}</p>
              <div style={styles.buttonGroup}>
                <button
                  style={styles.editButton}
                  onClick={() => setEditingReview(review)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noReviews}>No reviews available.</p>
      )}

      {/* Add/Update Review Form */}
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>{editingReview ? "Edit Review" : "Add a New Review"}</h2>
        <Formik
          initialValues={
            editingReview || { content: "", rating: "", user_id: "", book_id: "" }
          }
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form style={styles.form}>
            <label style={styles.label}>Review Content:</label>
            <Field name="content" type="text" style={styles.input} />
            <ErrorMessage name="content" component="div" style={styles.error} />

            <label style={styles.label}>Rating (1-5):</label>
            <Field name="rating" type="number" style={styles.input} />
            <ErrorMessage name="rating" component="div" style={styles.error} />

            <label style={styles.label}>Select User:</label>
            <Field as="select" name="user_id" style={styles.input}>
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="user_id" component="div" style={styles.error} />

            <label style={styles.label}>Select Book:</label>
            <Field as="select" name="book_id" style={styles.input}>
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </Field>
            <ErrorMessage name="book_id" component="div" style={styles.error} />

            <button type="submit" style={styles.submitButton}>
              {editingReview ? "Update Review" : "Add Review"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

// CSS
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  heading: {
    fontSize: "2em",
    color: "#333",
    marginBottom: "20px",
  },
  reviewsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    width: "90%",
    marginBottom: "30px",
  },
  reviewCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  bookTitle: { fontSize: "1.3em", fontWeight: "bold" },
  reviewContent: { fontSize: "1.1em", margin: "10px 0" },
  rating: { fontSize: "1.1em", fontWeight: "bold", color: "#f39c12" },
  user: { fontSize: "0.9em", color: "#555" },
  buttonGroup: { marginTop: "10px" },
  editButton: { padding: "8px", marginRight: "10px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: "5px" },
  deleteButton: { padding: "8px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px" },
  formContainer: { width: "80%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
  formTitle: { textAlign: "center", fontSize: "1.5em" },
  label: { display: "block", fontWeight: "bold", marginTop: "10px" },
  input: { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" },
  submitButton: { width: "100%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", fontSize: "1.2em" },
};

export default ReviewsSection;
