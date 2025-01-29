import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import BooksContainer from './pages/BooksContainer';
import AddBookForm from './pages/AddBookForm';
import UsersContainer from './pages/UsersContainer';
import ReviewsSection from './pages/ReviewsSection';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<BooksContainer />} />
        <Route path="/books/new" element={<AddBookForm />} />
        <Route path="/users" element={<UsersContainer />} />
        <Route path="/reviews" element={<ReviewsSection />} />
      </Routes>
    </Router>
  );
};

export default App;
