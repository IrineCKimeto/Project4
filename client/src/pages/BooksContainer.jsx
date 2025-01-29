import React, { useEffect, useState } from "react";

const BooksContainer = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [updatedBook, setUpdatedBook] = useState({ title: "", author: "", genre: "" });

  // Fetch all books from the backend
  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // Handle delete book
  const handleDeleteBook = (id) => {
    fetch(`http://localhost:5000/books/${id}`, { method: "DELETE" })
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
        alert("Book deleted successfully!");
      })
      .catch((error) => console.error("Error deleting book:", error));
  };

  // Handle edit button click
  const handleEditClick = (book) => {
    setEditingBook(book);
    setUpdatedBook({ title: book.title, author: book.author, genre: book.genre });
  };

  // Handle update book
  const handleUpdateBook = (event) => {
    event.preventDefault();
    fetch(`http://localhost:5000/books/${editingBook.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook),
    })
      .then((response) => response.json())
      .then((updatedBookData) => {
        setBooks(
          books.map((book) => (book.id === updatedBookData.id ? updatedBookData : book))
        );
        setEditingBook(null);
        alert("Book updated successfully!");
      })
      .catch((error) => console.error("Error updating book:", error));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>All Books</h1>

      {books.length === 0 ? (
        <p style={styles.noBooksText}>No books available. Add one from the "Add Book" page!</p>
      ) : (
        <div style={styles.gridContainer}>
          {books.map((book) => (
            <div key={book.id} style={styles.card}>
              <div style={styles.cardContent}>
                <h3 style={styles.bookTitle}>{book.title}</h3>
                <p style={styles.bookAuthor}>by {book.author}</p>
                <p style={styles.bookGenre}>{book.genre}</p>
              </div>

              <div style={styles.buttonContainer}>
                <button onClick={() => handleEditClick(book)} style={styles.updateButton}>
                  Update
                </button>
                <button onClick={() => handleDeleteBook(book.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>

              {editingBook && editingBook.id === book.id && (
                <form onSubmit={handleUpdateBook} style={styles.editForm}>
                  <input
                    type="text"
                    value={updatedBook.title}
                    onChange={(e) => setUpdatedBook({ ...updatedBook, title: e.target.value })}
                    placeholder="Title"
                    style={styles.input}
                  />
                  <input
                    type="text"
                    value={updatedBook.author}
                    onChange={(e) => setUpdatedBook({ ...updatedBook, author: e.target.value })}
                    placeholder="Author"
                    style={styles.input}
                  />
                  <input
                    type="text"
                    value={updatedBook.genre}
                    onChange={(e) => setUpdatedBook({ ...updatedBook, genre: e.target.value })}
                    placeholder="Genre"
                    style={styles.input}
                  />
                  <button type="submit" style={styles.saveButton}>Save Changes</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    width: "80%",
    margin: "auto",
    textAlign: "center",
  },
  heading: {
    fontSize: "2em",
    color: "#333",
    marginBottom: "20px",
  },
  noBooksText: {
    fontSize: "1.2em",
    color: "#666",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "left",
  },
  cardContent: {
    marginBottom: "10px",
  },
  bookTitle: {
    fontSize: "1.5em",
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: "1.1em",
    fontStyle: "italic",
    color: "#555",
  },
  bookGenre: {
    fontSize: "1em",
    color: "#777",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  updateButton: {
    padding: "8px 12px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editForm: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  saveButton: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default BooksContainer;
