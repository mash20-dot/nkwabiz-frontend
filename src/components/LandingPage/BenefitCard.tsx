type BenefitCardProps = {
  image: string;
  title: string;
  description: string;
};

const BenefitCard = ({ image, title, description }: BenefitCardProps) => {
  return (
    <div className="w-full h-full bg-blue-900 text-white px-6 py-8 md:px-10 lg:px-16 lg:py-16 flex flex-col items-center gap-15">
      <div>
        <img src={image} alt={title} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default BenefitCard;
