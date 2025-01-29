import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddUserForm = ({ setUsers }) => {
  const initialValues = {
    name: '',
    email: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert('User added successfully!');
          setUsers((prevUsers) => [...prevUsers, data]); // Update state
          resetForm();
        }
      })
      .catch((error) => console.error('Error adding user:', error));
  };
  

  return (
    <div>
      <h2>Add a New User</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <label>Name:</label>
          <Field name="name" type="text" />
          <ErrorMessage name="name" component="div" />

          <label>Email:</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" component="div" />

          <button type="submit">Add User</button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddUserForm;
