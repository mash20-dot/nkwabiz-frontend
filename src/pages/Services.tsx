import { MessagesSquare } from "lucide-react";
import { Store } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import { useService } from "../context/ServiceContext";
import { useNavigate } from "react-router-dom";

const ourServices = [
  {
    name: "Bulk SMS",
    description: "Send bulk SMS to your customers",
    href: "/sms/dashboard",
    icon: MessagesSquare,
    serviceType: "sms" as const,
  },
  {
    name: "Inventory",
    description: "Manage your products and inventory",
    href: "/dashboard",
    icon: Store,
    serviceType: "inventory" as const,
  },
];

const Services = () => {
  const navigate = useNavigate();
  const { setActiveService } = useService();

  const handleServiceClick = (
    serviceType: "sms" | "inventory",
    href: string
  ) => {
    setActiveService(serviceType);
    navigate(href);
  };
  return (
    <div className="w-full h-dvh p-0 md:px-10 lg:px-20 md:py-10 lg:py-10  bg-gray-50">
      <div className="w-full max-w-[1280px] h-full flex flex-col border border-gray-200 bg-white shadow-sm rounded-lg">
        <div className="w-full px-6 md:px-8 lg:px-8 py-5 flex items-start justify-start border-b border-gray-200">
          <h1 className="text-xl font-medium text-gray-800">
            Nkwabiz Services
          </h1>
        </div>
        <div className="w-full p-6 md:p-8 lg:p-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ourServices.map((service, index) => (
            <ServiceCard
              key={index}
              serviceName={service.name}
              description={service.description}
              onClick={() =>
                handleServiceClick(service.serviceType, service.href)
              }
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
