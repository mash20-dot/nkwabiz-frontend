import { TrendingUp, Clock, Shield, Lightbulb } from "lucide-react";
const Benefits = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            Benefits
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Why choose NkwaBiz?
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Our platform is designed specifically for African small businesses
            with your unique needs in mind.
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-start">
              <div className="bg-blue-100 rounded-lg p-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Increased Profitability
              </h3>
              <p className="mt-2 text-gray-600">
                Businesses using NkwaBiz report an average 23% increase in
                profitability through better inventory management and reduced
                waste.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Reduce stockouts and lost sales
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Identify your most profitable products
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Optimize pricing strategies
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-start">
              <div className="bg-blue-100 rounded-lg p-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Save Valuable Time
              </h3>
              <p className="mt-2 text-gray-600">
                Automate tedious tasks and free up hours each week to focus on
                growing your business instead of paperwork.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Streamlined sales recording
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Automated inventory tracking
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Quick access to business reports
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-start">
              <div className="bg-blue-100 rounded-lg p-3">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Reduce Business Risks
              </h3>
              <p className="mt-2 text-gray-600">
                Make informed decisions based on data rather than guesswork to
                reduce financial risks.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Prevent inventory shortages
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Avoid overstocking perishable goods
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Track cash flow accurately
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-start">
              <div className="bg-blue-100 rounded-lg p-3">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                Business Growth Insights
              </h3>
              <p className="mt-2 text-gray-600">
                Gain valuable insights that help you identify growth
                opportunities and scale your business.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Sales trend analysis
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Seasonal business patterns
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500">
                    ✓
                  </span>
                  <span className="ml-2 text-gray-600">
                    Customer purchasing behavior
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Benefits;
