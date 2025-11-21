import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import Features from '../components/LandingPage/Features';
import HowItWorks from '../components/LandingPage/HowItWorks';
import Benefits from '../components/LandingPage/Benefits';
import Testimonials from '../components/LandingPage/Testimonials';
import FAQ from '../components/LandingPage/FAQ';
import CTA from '../components/LandingPage/CTA';
import Footer from '../components/LandingPage/Footer';
import Youtubesection from '../components/LandingPage/Youtubesection';
import Feedback from '../components/LandingPage/Feedback';

const Home = () => {
  const pageTitle = "Nkwabiz – Ghana Best Business Management Software";
  const pageDescription = "Nkwabiz is a sales, inventory, bulk sms platform helping businesses grow faster and easier.";
  const pageURL = "https://www.nkwabiz.com/";
  const pageImage = "https://www.nkwabiz.com/og-image.png"; // Replace with your OG image

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          {/* Basic SEO */}
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <link rel="canonical" href={pageURL} />

          {/* Open Graph / Facebook */}
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={pageURL} />
          <meta property="og:image" content={pageImage} />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={pageImage} />

          {/* Viewport */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>

        {/* Page Sections */}
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <HowItWorks />
          <Features />
          <Youtubesection />
          <Benefits />
          <Testimonials />
          <FAQ />
          <Feedback />
          {/* <CTA /> */}
        </main>
        <Footer />
        <FloatingFeedbackButton />
      </div>
    </HelmetProvider>
  );
};

export default Home;
