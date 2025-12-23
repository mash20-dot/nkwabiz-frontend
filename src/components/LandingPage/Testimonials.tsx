import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      content:
        "NkwaBiz transformed how I manage my small grocery store. I can now track inventory, monitor sales, and make better business decisions with the analytics dashboard.",
      author: "Grace Mensah",
      role: "Owner, Grace's Groceries",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      rating: 5,
    },
    {
      content:
        "Since implementing NkwaBiz, I've reduced stockouts by 60% and increased my monthly revenue by tracking which products sell best. The interface is intuitive even for non-tech users.",
      author: "Kwame Osei",
      role: "Manager, Kwame General Store",
      image:
        "https://images.unsplash.com/photo-1506634572416-48cdfe530110?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      rating: 5,
    },
    {
      content:
        "As a new business owner, I needed something simple yet powerful to manage my shop. NkwaBiz provides exactly what I need without overwhelming me with complicated features.",
      author: "Abena Dankwa",
      role: "Proprietor, Abena Fashion House",
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      rating: 5,
    },
    {
      content:
        "Managing my pharmacy inventory was chaotic before NkwaBiz. Now I can track expiry dates, reorder levels, and sales all in one place. This has saved me so much time!",
      author: "Dr. Yaw Amponsah",
      role: "Owner, Amponsah Pharmacy",
      image: "https://i.imgur.com/tIO8BB4.jpg",
      rating: 5,
    },
    {
      content:
        "The reporting features are fantastic! I can see which products are moving fast and which are not. This helps me make smarter purchasing decisions for my boutique.",
      author: "Esi Quartey",
      role: "Proprietor, Esi Elegance Boutique",
      image: "https://i.imgur.com/86g6iQ9.jpg",
      rating: 5,
    },
    {
      content:
        "I run three shops and NkwaBiz helps me manage all of them from one dashboard. The sales tracking and inventory management features are game changers for my business.",
      author: "Kofi Addai",
      role: "CEO, Addai Enterprises",
      image: "https://i.imgur.com/VFk9okE.jpg",
      rating: 5,
    },
    {
      content:
        "Finally, a business tool that understands the needs of small African businesses! The customer support is excellent and the platform is always improving.",
      author: "Akua Frimpong",
      role: "Manager, Frimpong Cosmetics",
      image: "https://i.imgur.com/PHBUgWa.jpg",
      rating: 5,
    },
    {
      content:
        "NkwaBiz has made running my hardware store so much easier. I no longer lose track of items or miss reorder dates. My customers are happier because products are always in stock.",
      author: "Samuel Boateng",
      role: "Owner, Boateng Hardware",
      image: "https://i.imgur.com/JLs8v0r.jpg",
      rating: 5,
    },
  ];

  return (
    <div
      id="testimonials"
      className="bg-linear-to-b from-white to-gray-50 py-8 md:py-16 lg:py-25 overflow-hidden"
    >
      <div className="">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Trusted by business owners
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            See what our customers have to say about how NkwaBiz has improved
            their business operations.
          </p>
        </div>

        {/* Scrolling Testimonials Container */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling container */}
          <div className="flex gap-6 animate-scroll-testimonials">
            {/* First set of testimonials */}
            {testimonials.map((testimonial, index) => (
              <div
                key={`first-${index}`}
                className="shrink-0 w-96 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:scale-105"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100"
                    src={testimonial.image}
                    alt={testimonial.author}
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial, index) => (
              <div
                key={`second-${index}`}
                className="shrink-0 w-96 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:scale-105"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100"
                    src={testimonial.image}
                    alt={testimonial.author}
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/testimonials"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Read more success stories
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scroll-testimonials {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-testimonials {
          animation: scroll-testimonials 40s linear infinite;
        }

        .animate-scroll-testimonials:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
