import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookListingPage from './Components/BookListingPage';
import BookDetailsPage from './Components/BookDetailsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BookListingPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;