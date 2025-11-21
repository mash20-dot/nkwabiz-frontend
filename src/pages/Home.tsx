import React from 'react';
import { Helmet } from 'react-helmet';
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
import FloatingFeedbackButton from '../components/LandingPage/FloatingFeedbackButton';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Nkwabiz – Ghana business management system</title>
        <meta
          name="description"
          content="Nkwabiz is a sales, inventory, bulk sms system helping business grow faster and easier."
        />
        <link rel="canonical" href="https://www.nkwabiz.com/" />
      </Helmet>

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
    </div>
  );
};

export default Home;
