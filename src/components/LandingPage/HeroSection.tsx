import { Link } from "react-router-dom";
import Button from "../Button";

const HeroSection = () => {
  return (
    <div className="bg-white px-4 py-6 md:px-6 lg:px-16 lg:py-8 w-full h-full md:h-[1024px] lg:h-[1024px]">
      <div className="w-full h-full flex flex-col gap-8 items-start justify-start">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl  max-w-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
              <span className="block xl:inline">Run Your Business Smarter</span>
              {"-"}
              <span className="block xl:inline text-blue-600">
                Track Inventory & Reach Customers Instantly
              </span>
            </h1>
            <p className="text-base text-gray-500 max-w-2xl md:text-lg lg:text-lg">
              Nkwabiz helps growing businesses manage stock, track sales, and
              send bulk SMS to customers — all from one simple platform.
            </p>
          </div>
          <div className="flex gap-3 sm:justify-center lg:justify-start">
            <Link to="/login">
              <Button className="h-12 bg-blue-600 text-white font-semibold hover:bg-blue-700 border-none">
                Get Started
              </Button>
            </Link>
            <Link to="/features">
              <Button className="h-12 bg-blue-100 font-semibold text-blue-600 hover:bg-blue-200 border-none">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full flex-1 flex bg-blue-100"></div>
      </div>
    </div>
  );
};

export default HeroSection;
