import React from 'react';
import { Routes, Route } from 'react-router-dom';

import "./GlobalStyles.scss";

// Global Context
import { StoreProvider } from './globalContext/StoreContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AlertUser from './components/AlertUser';

// Pages
import Home from './pages/Home';
import CreateListing from './pages/CreateListing';
import NewUser from './pages/NewUser';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';

function App() {

  return (
    <StoreProvider>
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/register" element={<NewUser />} />
          <Route path="/user/:displayName" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>
      <div id="footer-spacer" aria-hidden="true" />
      <Footer />
      <AlertUser />
    </StoreProvider>
  );
}

export default App;
