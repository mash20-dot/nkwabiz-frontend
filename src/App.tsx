import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import SalesPage from './pages/SalesPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import FeaturesPage from './pages/FeaturesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import PricingPage from './pages/PricingPage';
import NotificationsPage from './pages/NotificationsPage';
import SupplierPage from './pages/SupplierPage';
import ReportsPage from './pages/ReportsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ExpensesPage from './pages/ExpensesPage';
import { isAuthenticated } from './utils/auth';

export function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={isAuthenticated() ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/products" element={isAuthenticated() ? <Layout><Products /></Layout> : <Navigate to="/login" />} />
        <Route path="/products/:name" element={isAuthenticated() ? <Layout><ProductDetailsPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/sales" element={isAuthenticated() ? <Layout><SalesPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/analytics" element={isAuthenticated() ? <Layout><Analytics /></Layout> : <Navigate to="/login" />} />
        <Route path="/expenses" element={isAuthenticated() ? <Layout><ExpensesPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated() ? <Layout><Settings /></Layout> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated() ? <Layout><NotificationsPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/suppliers" element={isAuthenticated() ? <Layout><SupplierPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated() ? <Layout><ReportsPage /></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}