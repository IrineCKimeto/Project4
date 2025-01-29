import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddBookForm = ({ setBooks }) => {
  const initialValues = {
    title: "",
    author: "",
    genre: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Author is required"),
    genre: Yup.string().required("Genre is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    fetch("http://localhost:5000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Book added successfully!");
        resetForm();
        setBooks((prevBooks) => [...prevBooks, data]);
      })
      .catch((error) => console.error("Error adding book:", error));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add a New Book</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form style={styles.form}>
          <label style={styles.label}>Title:</label>
          <Field name="title" type="text" style={styles.input} />
          <ErrorMessage name="title" component="div" style={styles.error} />

          <label style={styles.label}>Author:</label>
          <Field name="author" type="text" style={styles.input} />
          <ErrorMessage name="author" component="div" style={styles.error} />

          <label style={styles.label}>Genre:</label>
          <Field name="genre" type="text" style={styles.input} />
          <ErrorMessage name="genre" component="div" style={styles.error} />

          <button type="submit" style={styles.button}>Add Book</button>
        </Form>
      </Formik>
    </div>
  );
};

// **Inline CSS Styles**
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Center vertically in viewport
  },
  heading: {
    fontSize: "2em",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: "1.1em",
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "1em",
  },
  error: {
    color: "red",
    fontSize: "0.9em",
    marginBottom: "10px",
  },
  button: {
    padding: "10px",
    fontSize: "1.1em",
    color: "#fff",
    backgroundColor: "#28a745", // ✅ Green Button
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default AddBookForm;
