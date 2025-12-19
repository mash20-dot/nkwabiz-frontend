import { Link } from "react-router-dom";
import Button from "../Button";
import BulksmsDashboard from "../../../asset/Bulksms-dashboard.png";

const HeroSection = () => {
  return (
    <div className="bg-white px-6 py-10 sm:py-12 sm:px-10 lg:px-16 lg:py-16 w-full">
      <div className="w-full h-full flex flex-col gap-8 lg:gap-12 items-start justify-start">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl max-w-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
              Power Your Business Communication Across SMS, Email & USSD
            </h1>
            <p className="text-base text-gray-500 max-w-3xl md:text-lg lg:text-lg">
              Send bulk messages, automate emails, and build USSD experiences
              that reach customers instantly — all from one reliable platform.
            </p>
          </div>
          <div className="flex gap-3 justify-start">
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
        <div className="w-full flex p-4 lg:p-8 rounded-md lg:rounded-lg bg-blue-100">
          <img
            className="rounded-md lg:rounded-lg w-full h-auto object-contain"
            src={BulksmsDashboard}
            alt="Bulk SMS Dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
