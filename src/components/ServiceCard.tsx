import { link } from "fs";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ServiceCardProps = {
  linkPath: string;
  serviceName: string;
  icon: LucideIcon;
};

const ServiceCard = ({
  serviceName,
  icon: Icon,
  linkPath,
}: ServiceCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(linkPath)}
      className="flex group flex-col bg-white cursor-pointer hover:bg-blue-50 hover:border-blue-600 gap-4 items-center justify-center p-8 border border-gray-200 rounded-lg"
    >
      <Icon className="w-8 h-8 text-blue-600" />
      <span className="text-base font-medium text-gray-600 group-hover:text-blue-600">
        {serviceName}
      </span>
    </div>
  );
};

export default ServiceCard;
