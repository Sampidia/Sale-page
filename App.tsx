
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProductsListPage from './pages/ProductsListPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
