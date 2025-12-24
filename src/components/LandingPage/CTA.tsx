import Button from "../Button";

const CTA = () => {
  return (
    <div className="w-full bg-white px-6 py-8 md:px-10 md:py-16 lg:px-20 lg:py-25 flex flex-col items-center gap-15">
      <div className="bg-blue-800 w-full h-120 flex flex-col gap-10 items-center justify-center rounded-xl">
        <div className="text-white text-center flex flex-col gap-4">
          <h2 className="text-3xl max-w-4xl font-bold text-white md:text-4xl lg:text-5xl leading-[120%]">
            Start Communicating Better Today
          </h2>
          <p className="text-base text-gray-200 max-w-3xl md:text-lg lg:text-lg">
            Whether you’re sending thousands of messages or building USSD
            workflows, Nkwabiz gives you the tools to reach your users
            instantly.
          </p>
        </div>
        <Button>Get Started</Button>
      </div>
    </div>
  );
};
export default CTA;
