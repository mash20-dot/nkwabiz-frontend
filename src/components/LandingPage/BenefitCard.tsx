type BenefitCardProps = {
  image: string;
  title: string;
  description: string;
};

const BenefitCard = ({ image, title, description }: BenefitCardProps) => {
  return (
    <div className="w-full h-full bg-blue-100/5 hover:bg-blue-100/15 cursor-pointer rounded-md text-white px-6 py-6  flex flex-col items-center gap-6">
      <div>
        <img src={image} alt={title} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </div>
  );
};

export default BenefitCard;
