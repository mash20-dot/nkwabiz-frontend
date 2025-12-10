import React, { useState } from "react";
import { ServiceProvider } from "./context/ServiceContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";

// Inventory Service Pages
import Dashboard from "./pages/Inventory/Dashboard";
import Products from "./pages/Inventory/Products";
import SalesPage from "./pages/Inventory/SalesPage";
import Analytics from "./pages/Inventory/Analytics";
import Settings from "./pages/Inventory/Settings";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Layout from "./components/Layout/Layout";
import Home from "./pages/LandingPage/Home";
import AboutUs from "./pages/LandingPage/AboutUs";
import FeaturesPage from "./pages/LandingPage/FeaturesPage";
import TestimonialsPage from "./pages/LandingPage/TestimonialsPage";
import PricingPage from "./pages/LandingPage/PricingPage";
import NotificationsPage from "./pages/Inventory/NotificationsPage";
import SupplierPage from "./pages/Inventory/SupplierPage";
import ReportsPage from "./pages/Inventory/ReportsPage";
import ProductDetailsPage from "./pages/Inventory/ProductDetailsPage";
import ExpensesPage from "./pages/Inventory/ExpensesPage";
import { isAuthenticated } from "./utils/auth";

// Bulk SMS Service Pages
import SmsDashboard from "./pages/BulkSMS/Dashboard";
import BulkSMS from "./pages/BulkSMS/BulkSms";
import SettingsPage from "./pages/Inventory/Settings";
import ContactsPage from "./pages/BulkSMS/Contacts";

// Services Page
import Services from "./pages/Services";

// Blog imports
import AdminBlogDashboard from "./pages/LandingPage/AdminBlogDashboard";
import AdminBlogEditor from "./pages/LandingPage/AdminBlogEditor";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/LandingPage/BlogPost";

// PWA Add to Home Screen Prompt
import AddToHomeScreenPrompt from "./components/LandingPage/AddToHomeScreenPrompt";
import UpdatePrompt from "./components/LandingPage/UpdatePrompt";
import AuthProvider from "./components/LandingPage/AuthProvider";

// Contexts
import { SmsProvider } from "@/context/SmsContext";
import { ContactsProvider } from "@/context/ContactsContext";
import TopUp from "./pages/BulkSMS/TopUp";
import PaymentVerification from "./pages/BulkSMS/PaymentVerification";

const WhatsAppButton: React.FC = (): JSX.Element | null => {
  const [showLabel, setShowLabel] = useState(true);
  const location = useLocation();

  const landingPages = [
    "/",
    "/about",
    "/features",
    "/testimonials",
    "/pricing",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/blog",
  ];
  const shouldShow =
    landingPages.includes(location.pathname) ||
    location.pathname.startsWith("/blog/");

  if (!shouldShow) return null;

  return (
    <a
      href="https://wa.me/233552148347"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      onMouseEnter={() => setShowLabel(true)}
    >
      {/* Label */}
      <div
        className={`bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-green-500 whitespace-nowrap transition-all duration-300 ${
          showLabel ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
      >
        <span className="text-sm font-semibold text-gray-800">
          contact us for help
        </span>
      </div>

      {/* WhatsApp Icon Button */}
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
        <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse" />
        <div className="relative bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ServiceProvider>
          <SmsProvider>
            <ContactsProvider>
              <Toaster position="top-right" richColors={true} />
              {/* PWA Update Prompt - Shows when new version is available */}
              <UpdatePrompt />

              {/* PWA Add to Home Screen Prompt */}
              <AddToHomeScreenPrompt />

              {/* WhatsApp Button - only shows on landing pages */}
              <WhatsAppButton />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* PUBLIC BLOG ROUTES */}
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:postId" element={<BlogPost />} />

                {/* ADMIN BLOG ROUTES - Protected */}
                <Route
                  path="/admin/blog"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <AdminBlogDashboard />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/admin/blog/new"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <AdminBlogEditor />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/admin/blog/edit/:postId"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <AdminBlogEditor />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                {/* Protected routes */}

                {/* Service Selection Page */}
                <Route
                  path="/services"
                  element={
                    isAuthenticated() ? <Services /> : <Navigate to="/login" />
                  }
                />

                {/* Inventory Services */}
                <Route
                  path="/dashboard"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <Dashboard />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/products"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <Products />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/products/:name"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <ProductDetailsPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/sales"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <SalesPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <Analytics />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <ExpensesPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/settings"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <Settings />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <NotificationsPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/suppliers"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <SupplierPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/reports"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <ReportsPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                {/* Bulk SMS Services */}
                <Route
                  path="/sms/dashboard"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <SmsDashboard />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/sms/bulksms"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <BulkSMS />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/sms/contacts"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <ContactsPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/sms/topup"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <TopUp />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/payment/verify"
                  element={
                    isAuthenticated() ? (
                      <PaymentVerification />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/sms/settings"
                  element={
                    isAuthenticated() ? (
                      <Layout>
                        <SettingsPage />
                      </Layout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            </ContactsProvider>
          </SmsProvider>
        </ServiceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
