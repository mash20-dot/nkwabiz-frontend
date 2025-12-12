import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  keywords?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  noindex = false,
  keywords,
  image = "https://www.nkwabiz.com/og-image.png",
}) => {
  const location = useLocation();
  const baseUrl = "https://www.nkwabiz.com";

  // Use provided canonical URL or construct from current path
  const canonicalUrl = canonical || `${baseUrl}${location.pathname}`;

  // Default values focusing on Bulk SMS
  const defaultTitle =
    "Nkwabiz - Bulk SMS Service Ghana | Business Management Solution";
  const defaultDescription =
    "Send bulk SMS to thousands of customers instantly in Ghana. Affordable SMS marketing platform with inventory management. Reach your customers effectively with Nkwabiz.";
  const defaultKeywords =
    "bulk sms ghana, sms marketing ghana, bulk sms service, send bulk sms, sms marketing, inventory management ghana, business management ghana";

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots meta tag */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Nkwabiz" />
      <meta property="og:locale" content="en_GH" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="author" content="Nkwabiz" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="GH" />
      <meta name="geo.placename" content="Ghana" />
    </Helmet>
  );
};

export default SEO;
