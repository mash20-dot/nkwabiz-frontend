import BenefitCard from "./BenefitCard";

const WhyNkwabiz = () => {
  return (
    <div className="w-full h-full bg-blue-900 text-white px-6 py-8 md:px-10 lg:px-16 lg:py-16 flex flex-col items-center gap-15">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <h2 className="text-3xl font-bold text-center">Why Nkwabiz?</h2>
        <p className="text-center text-gray-200">
          Nkwabiz is a platform that helps businesses send emails, SMS, and
          track sales.
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-10">
        <BenefitCard
          image="/asset/benefit-1.svg"
          title="Send Emails"
          description="Send emails to your customers with ease."
        />
        <BenefitCard
          image="/asset/benefit-2.svg"
          title="Send SMS"
          description="Send SMS to your customers with ease."
        />
        <BenefitCard
          image="/asset/benefit-3.svg"
          title="Track Sales"
          description="Track sales with ease."
        />
      </div>
    </div>
  );
};

export default WhyNkwabiz;
