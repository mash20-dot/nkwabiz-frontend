import Button from "../Button";

const CTA = () => {
  return (
    <div className="w-full bg-white px-6 py-8 md:px-10 md:py-16 lg:px-20 lg:py-25 flex flex-col items-center">
      <div className="bg-linear-to-b from-blue-800 to-blue-900 px-6 lg:px-8 w-full h-90 lg:h-120 flex flex-col gap-6 items-center justify-center rounded-xl">
        <div className="text-white text-center flex flex-col gap-3 lg:gap-4">
          <h2 className="text-3xl max-w-4xl font-bold text-white md:text-4xl lg:text-5xl leading-[120%]">
            Start Communicating Better Today
          </h2>
          <p className="text-sm lg:text-base text-gray-100 max-w-3xl">
            Whether you’re sending thousands of messages or building USSD
            workflows, Nkwabiz gives you the tools to reach your users
            instantly.
          </p>
        </div>
        <Button className="bg-white h-11 text-blue-800 border-none hover:bg-blue-50">
          Get Started
        </Button>
      </div>
    </div>
  );
};
export default CTA;
