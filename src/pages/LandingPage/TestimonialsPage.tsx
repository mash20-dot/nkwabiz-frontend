import React from "react";
import SEO from "../../pages/LandingPage/SEO";
import Navbar from "../../components/LandingPage/Navbar";
import Footer from "../../components/LandingPage/Footer";
import { Star, Quote } from "lucide-react";

const TestimonialsPage = () => {
  const featuredTestimonials = [
    {
      content:
        "NkwaBiz transformed how I manage my small grocery store. The bulk SMS feature helped me reach all my customers with promotional offers, and I can now track inventory and monitor sales. Since implementing the system, I've reduced stockouts by 70% and increased my monthly revenue by 25%.",
      author: "Grace Mensah",
      role: "Owner, Grace's Groceries",
      location: "Accra, Ghana",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      rating: 5,
    },
    {
      content:
        "The bulk SMS campaigns have been a game-changer for my business! I can reach thousands of customers instantly with promotions. Combined with the inventory management, I've reduced stockouts by 60% and increased my monthly revenue. My staff picked it up in just one day of training.",
      author: "Kwame Osei",
      role: "Manager, Kwame General Store",
      location: "Kumasi, Ghana",
      image:
        "https://images.unsplash.com/photo-1506634572416-48cdfe530110?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      rating: 5,
    },
    {
      content:
        "As a new business owner, I needed something simple yet powerful. NkwaBiz's bulk SMS service helps me stay connected with my customers, and the inventory management is perfect. The low stock alerts and being able to send SMS promotions from my phone has been incredibly helpful.",
      author: "Abena Dankwa",
      role: "Proprietor, Abena Fashion House",
      location: "Takoradi, Ghana",
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      rating: 5,
    },
  ];

  const additionalTestimonials = [
    {
      content:
        "Sending bulk SMS to customers about medication reminders and special offers has increased my customer retention. NkwaBiz makes it so easy to manage both SMS campaigns and pharmacy inventory.",
      author: "Dr. Samuel Nkrumah",
      role: "Owner, Wellness Pharmacy",
      location: "Cape Coast, Ghana",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4,
    },
    {
      content:
        "The analytics feature combined with bulk SMS marketing has been eye-opening. I send targeted SMS campaigns to my best customers and track which products sell best. My SMS campaigns have a 40% response rate!",
      author: "Fatima Diallo",
      role: "Owner, Fatima's Fashion",
      location: "Accra, Ghana",
      image:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 5,
    },
    {
      content:
        "I run three hardware stores, and the bulk SMS feature lets me notify customers across all locations about new stock arrivals. The mobile access means I can send SMS campaigns even when visiting suppliers.",
      author: "Joseph Mensah",
      role: "Owner, Mensah Hardware",
      location: "Tema, Ghana",
      image:
        "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 5,
    },
    {
      content:
        "The customer support team is exceptional. They helped me set up my first bulk SMS campaign and taught me how to segment my customer list. Response has been amazing!",
      author: "Esther Boateng",
      role: "Manager, Esther's Electronics",
      location: "Kumasi, Ghana",
      image:
        "https://images.unsplash.com/photo-1509955252650-8f558c2b8735?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 5,
    },
    {
      content:
        "I was worried about using technology, but sending bulk SMS with NkwaBiz is so simple! I can now reach all my customers with one click. Sales increased by 35% in the first month.",
      author: "Ibrahim Sule",
      role: "Owner, Ibrahim's Imports",
      location: "Tamale, Ghana",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4,
    },
    {
      content:
        "Sending SMS about daily specials has dramatically increased foot traffic. The ability to schedule bulk SMS campaigns in advance saves me so much time. I can focus on cooking while NkwaBiz handles marketing.",
      author: "Ama Darko",
      role: "Owner, Ama's Eatery",
      location: "Accra, Ghana",
      image:
        "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 5,
    },
  ];

  const videoTestimonials = [
    {
      title: "How Bulk SMS Helped My Grocery Store Grow",
      author: "Kofi Asante",
      business: "Asante Family Market",
      thumbnail:
        "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "From Struggling to Thriving with SMS Marketing",
      author: "Nana Akua Mensah",
      business: "Akua's Boutique",
      thumbnail:
        "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "Managing Multiple Stores with Bulk SMS & NkwaBiz",
      author: "Daniel Owusu",
      business: "Owusu Retail Group",
      thumbnail:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    },
  ];

  return (
    <>
      <SEO
        title="Customer Success Stories - Bulk SMS & Business Growth | Nkwabiz Ghana"
        description="See how Ghanaian businesses use Nkwabiz bulk SMS and business management tools to boost sales, improve customer engagement, and grow. Real testimonials from satisfied customers."
        canonical="https://www.nkwabiz.com/testimonials"
        keywords="bulk sms success stories ghana, customer testimonials ghana, sms marketing results, business growth stories, nkwabiz reviews"
      />

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-blue-700 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Success Stories
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Hear from real business owners who have transformed their
                operations with NkwaBiz bulk SMS and management tools.
              </p>
            </div>
          </div>

          {/* Featured Testimonials */}
          <div className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                  Testimonials
                </h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                  From our satisfied customers
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  Discover how NkwaBiz bulk SMS and business tools have helped businesses across Ghana improve
                  their operations and increase profitability.
                </p>
              </div>
              <div className="mt-16">
                {featuredTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } overflow-hidden`}
                  >
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                      <div className="absolute top-0 bottom-0 left-3/4 hidden lg:block">
                        <Quote className="h-64 w-64 text-gray-100" />
                      </div>
                      <div className="relative lg:flex lg:items-center">
                        <div className="lg:w-1/3">
                          <div className="relative h-64 w-64 rounded-full overflow-hidden mx-auto">
                            <img
                              className="h-full w-full object-cover"
                              src={testimonial.image}
                              alt={testimonial.author}
                            />
                          </div>
                        </div>
                        <div className="relative mt-10 lg:mt-0 lg:ml-10 lg:w-2/3">
                          <div className="flex mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5 text-yellow-400"
                                fill="currentColor"
                              />
                            ))}
                          </div>
                          <blockquote>
                            <p className="text-xl text-gray-600 italic">
                              "{testimonial.content}"
                            </p>
                            <footer className="mt-8">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <div className="text-lg font-medium text-gray-900">
                                    {testimonial.author}
                                  </div>
                                  <div className="text-base text-blue-600">
                                    {testimonial.role}
                                  </div>
                                  <div className="text-base text-gray-500">
                                    {testimonial.location}
                                  </div>
                                </div>
                              </div>
                            </footer>
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Testimonials */}
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                  Video Stories
                </h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                  Watch our customer stories
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  Hear directly from business owners about their experience with
                  NkwaBiz bulk SMS and business management.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {videoTestimonials.map((video, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="relative pb-[56.25%]">
                      <div className="absolute inset-0">
                        <img
                          className="h-full w-full object-cover"
                          src={video.thumbnail}
                          alt={video.title}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                            <div className="h-0 w-0 border-y-8 border-y-transparent border-l-[16px] border-l-blue-600 ml-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900">
                        {video.title}
                      </h3>
                      <p className="mt-2 text-gray-600">{video.author}</p>
                      <p className="text-sm text-blue-600">{video.business}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* More Testimonials Grid */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                  More Success Stories
                </h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                  Businesses like yours are thriving with bulk SMS
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  See how businesses across different industries are benefiting
                  from NkwaBiz bulk SMS and management tools.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {additionalTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg shadow-sm p-6"
                  >
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={testimonial.image}
                          alt={testimonial.author}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-blue-600">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-700">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to join our success stories?</span>
                <span className="block text-blue-200">
                  Start sending bulk SMS and grow your business today.
                </span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">

                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                  >
                  Get started
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">

                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
                  >
                Contact sales
              </a>
            </div>
          </div>
      </div>
    </div >
        </main >
  <Footer />
      </div >
    </>
  );
};

export default TestimonialsPage;