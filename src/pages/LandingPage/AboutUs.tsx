import React from "react";
import SEO from "../../pages/LandingPage/SEO";
import Navbar from "../../components/LandingPage/Navbar";
import Footer from "../../components/LandingPage/Footer";
import { Users, Award, Globe, Clock, Heart } from "lucide-react";

const AboutUs = () => {
  return (
    <>
      <SEO
        title="About Nkwabiz - Leading Bulk SMS & Business Management Provider in Ghana"
        description="Learn how Nkwabiz helps Ghanaian businesses reach thousands of customers through reliable bulk SMS services and inventory management. Empowering 500+ businesses across Africa since 2020."
        canonical="https://www.nkwabiz.com/about"
        keywords="bulk sms provider ghana, sms marketing company ghana, business management ghana, about nkwabiz, sms service ghana, inventory management africa"
      />

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-blue-700 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                About NkwaBiz
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Empowering small businesses across Africa with bulk SMS marketing and powerful management tools.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Our Story
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    NkwaBiz was founded in 2020 with a simple mission: to help
                    small business owners in Africa reach more customers through bulk SMS and streamline their operations
                    to increase profitability.
                  </p>
                  <p className="mt-4 text-lg text-gray-500">
                    After working with hundreds of small shop owners, we noticed a
                    common challenge – many struggled to reach their customers effectively and were using paper ledgers or basic
                    spreadsheets to track inventory and sales. This led to errors,
                    lost revenue, and countless hours spent on administrative
                    tasks.
                  </p>
                  <p className="mt-4 text-lg text-gray-500">
                    We created NkwaBiz to solve these problems with an affordable bulk SMS platform combined with inventory management—a solution
                    that's easy to use and specifically designed for
                    the unique needs of African businesses.
                  </p>
                </div>
                <div className="mt-10 lg:mt-0">
                  <img
                    className="rounded-lg shadow-xl"
                    src="https://images.unsplash.com/photo-1739292774739-ee38cd9a5735?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                    alt="Team discussing business strategy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                  Our Mission
                </h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                  Transforming small businesses through bulk SMS and technology
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  We believe that every business, no matter how small, deserves
                  access to powerful bulk SMS marketing and management tools.
                </p>
              </div>
              <div className="mt-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Local Focus
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Our bulk SMS platform is built specifically for the African market,
                      considering local business practices and mobile network coverage.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Time Saving
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      We help business owners save valuable time by automating
                      SMS campaigns, managing inventory, and providing instant insights.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Community Impact
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      By helping businesses reach more customers through SMS and thrive, we contribute to stronger
                      local economies and communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                  Our Team
                </h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                  Meet the people behind NkwaBiz
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  A passionate team dedicated to empowering small business owners
                  across Africa with bulk SMS and management solutions.
                </p>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Nkwabiz",
                    role: "Founder & CEO",
                    image:
                      "https://i.postimg.cc/pLyJhZmB/51327299afe18483f5ae04d029ae31aa-high.webp",
                    bio: "Former small business owner with 15 years of experience in retail management and SMS marketing.",
                  },
                  {
                    name: "Ama Owusu",
                    role: "Head of Product",
                    image:
                      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    bio: "Product designer with expertise in creating intuitive SMS campaign interfaces for diverse users.",
                  },
                  {
                    name: "Kwame Boateng",
                    role: "Chief Technology Officer",
                    image:
                      "https://images.unsplash.com/photo-1524660988542-c440de9c0fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    bio: "Software engineer passionate about building reliable SMS delivery technology for local challenges.",
                  },
                ].map((person) => (
                  <div
                    key={person.name}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <img
                      className="w-full h-64 object-cover"
                      src={person.image}
                      alt={person.name}
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {person.name}
                      </h3>
                      <p className="text-sm text-blue-600">{person.role}</p>
                      <p className="mt-3 text-base text-gray-500">{person.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-blue-700 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-white">500+</div>
                  <div className="mt-2 text-xl text-blue-100">
                    Businesses using NkwaBiz
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-white">5</div>
                  <div className="mt-2 text-xl text-blue-100">
                    Countries in Africa
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-white">23%</div>
                  <div className="mt-2 text-xl text-blue-100">
                    Average revenue increase with SMS marketing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Want to learn more about our bulk SMS service?
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Our team is always ready to help you understand how NkwaBiz bulk SMS and management tools can
                  transform your business.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex rounded-md shadow">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Contact us
                    </a>
                  </div>
                  <div className="ml-3 inline-flex">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Schedule a demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;