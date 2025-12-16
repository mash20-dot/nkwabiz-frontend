import { Helmet } from "react-helmet";
import Navbar from "../../components/LandingPage/Navbar";
// import Hero from "../../components/LandingPage/Hero";
import Features from "../../components/LandingPage/Features";
import HowItWorks from "../../components/LandingPage/HowItWorks";
import Benefits from "../../components/LandingPage/Benefits";
import Testimonials from "../../components/LandingPage/Testimonials";
import FAQ from "../../components/LandingPage/FAQ";
import Footer from "../../components/LandingPage/Footer";
import Youtubesection from "../../components/LandingPage/Youtubesection";
import Feedback from "../../components/LandingPage/Feedback";
import LaptopAndMobile from "../../components/LandingPage/LaptopAndMobile";

import HeroSection from "@/components/LandingPage/HeroSection";

const Home = () => {
  const pageTitle =
    "Nkwabiz – Bulk SMS Ghana | Best Business Management Software";
  const pageDescription =
    "Send bulk SMS to thousands of customers in Ghana instantly. Affordable SMS marketing platform with inventory management. Reach customers via SMS, manage sales, track inventory & grow your business faster.";
  const pageURL = "https://www.nkwabiz.com/";
  const pageImage = "https://www.nkwabiz.com/og-image.png";
  const pageKeywords =
    "bulk sms ghana, bulk sms service ghana, send bulk sms, sms marketing ghana, mass sms ghana, business sms, promotional sms ghana, inventory management ghana, sales management, business management software ghana";

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        {/* Basic SEO - Bulk SMS Focused */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={pageURL} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageURL} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="Nkwabiz" />
        <meta property="og:locale" content="en_GH" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* Additional SEO */}
        <meta name="author" content="Nkwabiz" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="GH" />
        <meta name="geo.placename" content="Ghana" />

        {/* Structured Data for Business */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Nkwabiz",
            applicationCategory: "BusinessApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "GHS",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "150",
            },
            description: "Bulk SMS and business management platform for Ghana",
            operatingSystem: "Web, iOS, Android",
          })}
        </script>

        {/* Structured Data for Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Nkwabiz",
            url: "https://www.nkwabiz.com",
            logo: "https://www.nkwabiz.com/asset/nkwabiz-logo-big.svg",
            description:
              "Leading bulk SMS service and business management platform in Ghana",
            address: {
              "@type": "PostalAddress",
              addressCountry: "GH",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+233552148347",
              contactType: "Customer Service",
              availableLanguage: "English",
            },
          })}
        </script>
      </Helmet>

      {/* Page Sections */}
      <Navbar />
      <main className="grow">
        {/* <Hero /> */}
        <HeroSection />
        <HowItWorks />
        <LaptopAndMobile />
        <Youtubesection />
        <Features />
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
