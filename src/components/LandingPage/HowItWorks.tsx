import ProductCard from "./ProductCard";

import SignUp from "../../../asset/SignUp.png";
import Services from "../../../asset/Services.png";

// w-full md:w-1/2 lg:w-1/2 flex flex-col justify-center gap-4 lg:px-8 pb-6 lg:pb-0 md:pb-0

const steps = [
  {
    title: "Create an account",
    description:
      "Sign up and get instant access to all Nkwabiz communication tools!",
    className: "w-full sm:h-80 lg:h-90",
    image: SignUp,
  },
  {
    title: "Choose the service you need",
    description:
      "Select from Bulk SMS, inventory system, email marketing, and more, only what fits your business.",
    className: "lg:flex-row-reverse w-full sm:h-80 lg:h-90",
    image: Services,
  },
  {
    title: "Start communicating with your customers",
    description:
      "Send messages, manage contacts, or build automated flows to engage your customers instantly.",
    className: "w-full sm:h-80 lg:h-90",
    image: Services,
  },
];

const HowItWorks = () => {
  return (
    <div className="w-full bg-white px-6 py-15 md:px-10 md:py-16 lg:px-20 lg:py-25 flex flex-col items-center gap-12 lg:gap-15">
      <div className="text-center items-center flex flex-col gap-4">
        <h2 className="text-3xl max-w-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl text-center leading-[120%]">
          Simple steps to transform your business
        </h2>
        <p className="max-w-xl text-lg text-gray-500">
          Get started in minutes and reach your customers with ease.
        </p>
      </div>
      <div className="flex w-full flex-col gap-10 md:gap-15 lg:gap-15 relative">
        {steps.map((step, index) => (
          <ProductCard
            key={index}
            className={step.className}
            imgDivClass="bg-blue-100 rounded-md lg:rounded-lg px-3 py-3"
            image={step.image}
            imgClass="object-center rounded-sm lg:rounded-md"
          >
            <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col justify-center gap-4 lg:px-8 md:px-8 pb-6 lg:pb-0 md:pb-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold">
                {index + 1}
              </div>
              <div className="w-full flex flex-col gap-2">
                <h3 className="text-2xl font-medium text-gray-900">
                  {step.title}
                </h3>
                <p className=" text-gray-500">{step.description}</p>
              </div>
            </div>
          </ProductCard>
        ))}
      </div>
    </div>
  );
};
export default HowItWorks;
