import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddReviewForm = ({ bookId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Users:", data);
        setUsers(data);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const initialValues = {
    content: '',
    rating: '',
    user_id: '',
  };

  const validationSchema = Yup.object({
    content: Yup.string().required('Review content is required'),
    rating: Yup.number().min(1).max(5).required('Rating is required'),
    user_id: Yup.string().required('User selection is required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    fetch('http://localhost:5000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, book_id: bookId }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Review added successfully!');
        resetForm();
      })
      .catch((error) => console.error('Error adding review:', error));
  };

  return (
    <div>
      <h2>Add Review</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <div>
            <label>Review Content:</label>
            <Field name="content" type="text" />
            <ErrorMessage name="content" component="div" />
          </div>
          <div>
            <label>Rating (1-5):</label>
            <Field name="rating" type="number" />
            <ErrorMessage name="rating" component="div" />
          </div>
          <div>
            <label>Select User:</label>
            <Field as="select" name="user_id">
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </Field>
            <ErrorMessage name="user_id" component="div" />
          </div>
          <button type="submit">Submit Review</button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddReviewForm;
