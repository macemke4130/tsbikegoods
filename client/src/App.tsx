import React from 'react';
import { Routes, Route } from 'react-router-dom';

import "./GlobalStyles.scss";

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import CreateListing from './pages/CreateListing';
import NewUser from './pages/NewUser';

function App() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/register" element={<NewUser />} />
        </Routes>
      </main>
      <div id="footer-spacer" aria-hidden="true" />
      <Footer />
    </>
  );
}

export default App;
