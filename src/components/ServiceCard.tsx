import { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  serviceName: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
};

const ServiceCard = ({
  serviceName,
  icon: Icon,
  description,
  onClick,
}: ServiceCardProps) => {
  return (
    <div
      onClick={onClick}
      className="flex group flex-col bg-white cursor-pointer hover:bg-blue-50 hover:border-blue-600 gap-4 items-center justify-center p-8 border border-gray-200 rounded-lg"
    >
      <Icon className="w-8 h-8 text-blue-600" />
      <div className="flex flex-col gap-1 justify-center items-center">
        <span className="text-base text-center font-medium text-gray-700 group-hover:text-blue-600">
          {serviceName}
        </span>
        <span className="text-sm text-center text-gray-500 font-normal">
          {description}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
