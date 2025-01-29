import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreateUserForm = () => {
  const initialValues = { name: '', email: '' };

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
      .then(() => resetForm())
      .catch((error) => console.error('Error creating user:', error));
  };

  return (
    <div>
      <h2>Create User</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <Field name="name" type="text" placeholder="Enter name" />
          <ErrorMessage name="name" component="div" />
          <Field name="email" type="email" placeholder="Enter email" />
          <ErrorMessage name="email" component="div" />
          <button type="submit">Create User</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateUserForm;
