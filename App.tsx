
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProductsListPage from './pages/ProductsListPage';
import AIDocumentationPage from './pages/AIDocumentationPage';
import MobileAppsPage from './pages/MobileAppsPage';
import MobileAppDetailPage from './pages/MobileAppDetailPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ClaimPrizePage from './pages/ClaimPrizePage';
import GetCodePage from './pages/GetCodePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseDashboard from './components/CourseDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/product/ai-content-generator/documentation" element={<AIDocumentationPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/my-courses" element={<CourseDashboard />} />
          <Route path="/my-downloads" element={<CourseDashboard />} />
          <Route path="/apps" element={<MobileAppsPage />} />
          <Route path="/app/:id" element={<MobileAppDetailPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/claim-prize" element={<ClaimPrizePage />} />
          <Route path="/get-code" element={<GetCodePage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
