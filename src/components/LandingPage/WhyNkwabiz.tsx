import BenefitCard from "./BenefitCard";
import Message from "../../../asset/icons/message.png";
import Phonebook from "../../../asset/icons/phonebook.png";
import Lightning from "../../../asset/icons/lightning.png";
import CreditCard from "../../../asset/icons/credit.png";
import Growth from "../../../asset/icons/growth.png";
import Scalable from "../../../asset/icons/scalable.png";

const benefits = [
  {
    title: "Reach thousands instantly",
    description:
      "Send bulk SMS to thousands of contacts in seconds — perfect for alerts, promotions, and time-sensitive updates.",
    image: Message,
  },
  {
    title: "Organize contacts your way",
    description:
      "Save contacts by group or category, manage audiences easily, and send targeted messages without manual filtering.",
    image: Phonebook,
  },
  {
    title: "Messages delivered in real time",
    description:
      "Our infrastructure ensures fast, reliable delivery so your messages reach customers exactly when they matter.",
    image: Lightning,
  },
  {
    title: "No subscriptions. No waste.",
    description:
      "Buy SMS bundles and pay only for messages you send — no fixed monthly fees or hidden charges.",
    image: CreditCard,
  },
  {
    title: "From small teams to large campaigns",
    description:
      "Whether you’re sending a few alerts or running large campaigns, Nkwabiz scales with your business needs.",
    image: Growth,
  },
  {
    title: "Easy to use. Built to last.",
    description:
      "A clean dashboard, straightforward workflows, and a platform you can rely on every day.",
    image: Scalable,
  },
];

const WhyNkwabiz = () => {
  return (
    <div className="w-full bg-blue-800 text-white px-6 py-14 md:px-10 md:py-16 lg:px-20 lg:py-25 flex flex-col items-center gap-12 md:gap-15 lg:gap-15">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <h2 className="text-3xl max-w-3xl font-bold text-white md:text-4xl lg:text-5xl text-center leading-[120%]">
          Everything Businesses Need to Communicate at Scale
        </h2>
        <p className="text-center text-base md:text-base lg:text-lg text-gray-100">
          Built for speed, reliability, and flexibility — so you reach customers
          without friction.
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-6">
        {benefits.map((benefit, index) => (
          <BenefitCard
            key={index}
            image={benefit.image}
            title={benefit.title}
            description={benefit.description}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyNkwabiz;
