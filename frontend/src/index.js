import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import Register from './pages/register/Register';
import Account from './pages/account/Account';
import ProductPage from './pages/productpage/ProductPage';
import NotFound from './pages/notfound/NotFound';
import Collection from './pages/collection/Collection';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Faq from './pages/faq/Faq';
import Verification from './pages/verification/Verification';
import SizeGuide from './pages/sizeguide/SizeGuide';
import PrivacyPolicy from './pages/privacypolicy/PrivacyPolicy';
import TermsOfService from './pages/termsofservice/TermsOfService';


import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/products/:name" element={<ProductPage />} />

          <Route path="/collection/:name" element={<Collection />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/faq" element={<Faq />} />
          <Route path="/sizeguide" element={<SizeGuide />} />
          <Route path="/pp" element={<PrivacyPolicy />} />
          <Route path="/tos" element={<TermsOfService />} />

          <Route path="/verify/:token" element={<Verification />} />

          <Route path="/account" element={<Account />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/account/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </React.StrictMode>
  </motion.div>
);