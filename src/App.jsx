import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import WhatsAppFloat from './components/WhatsAppFloat';
import AIAssistantWidget from './components/AIAssistantWidget';

// Initialize GA4
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

// Scroll to top and track page view on route change
const RouteChangeTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Track page view
    if (GA_MEASUREMENT_ID) {
      ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
    }
  }, [pathname]);

  return null;
};

// Page Layout Wrapper
const PageLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col pt-20">
    <main className="flex-grow">
      {children}
    </main>
  </div>
);

const App = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname === '/admin';

  // Admin gets its own full-screen layout (no Navbar/Footer)
  if (isAdminRoute) {
    return (
      <>
        <RouteChangeTracker />
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </>
    );
  }

  return (
    <>
      <RouteChangeTracker />
      <Navbar />
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">404</h1>
              <p className="text-gray-500 text-lg">Oops! The page you are looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </PageLayout>
      <Footer />
      <WhatsAppFloat />
      <AIAssistantWidget />
    </>
  );
};

export default App;
