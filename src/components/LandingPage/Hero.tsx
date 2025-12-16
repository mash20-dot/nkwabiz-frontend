import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    // Stop pulsing after 5 seconds
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">
                  Run Your Business Smarter
                </span>{" "}
                <span className="block text-blue-600 xl:inline">
                  Track Inventory & Reach Customers Instantly
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Nkwabiz helps growing businesses manage stock, track sales, and
                send bulk SMS to customers — all from one simple platform.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Request a Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://i.imgur.com/qP7YjVk.jpg"
          alt="African business owner using digital device"
        />
      </div>

      {/* Floating Sign Up Button */}
      {/* <Link
        to="/login"
        className={`fixed left-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-r-lg shadow-lg transition-all duration-300 z-50 flex items-center gap-1 group ${
          isPulsing ? "animate-pulse" : ""
        }`}
      >
        <span className="text-xs whitespace-nowrap">SIGN UP FREE</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link> */}
    </div>
  );
};

export default Hero;
