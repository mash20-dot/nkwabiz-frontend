import ProductCard from "./ProductCard";
import { Badge } from "../base/badges/badges";
import Button from "../Button";
import { ChevronRight } from "lucide-react";
import SendSMS from "../../../asset/SendSMS.png";
import EmailMarketing from "../../../asset/EmailMarketing.png";

const Products = () => {
  return (
    <div className="bg-white px-6 py-8 md:px-10 md:py-16 lg:px-20 lg:py-25 flex flex-col items-center gap-15">
      <h2 className="text-3xl max-w-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl text-center">
        One platform. Multiple communication channels.
      </h2>
      <div className="w-full flex flex-col gap-6">
        <ProductCard className="group" image={SendSMS}>
          <div className="w-1/2 flex flex-col justify-center gap-4 px-8">
            <div className="w-full flex flex-col gap-2">
              <Badge className="bg-blue-100 border border-blue-200 text-blue-600">
                Bulk SMS
              </Badge>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Reach thousands instantly.
              </h3>
              <p className="text-base text-gray-500">
                Send fast, reliable SMS messages to thousands of customers
                instantly — for alerts, promotions, and critical notifications.
              </p>
            </div>
            <Button className="bg-transparent group-hover:bg-none group-hover:text-blue-600 border-none px-0 py-0 text-gray-500">
              Start Sending SMS
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </ProductCard>

        <ProductCard
          className="group flex-row-reverse"
          image={EmailMarketing}
          imgDivClass="px-0 py-0 lg:px-0 lg:py-0 "
          imgClass="w-full h-full object-center rounded-none lg:rounded-none"
        >
          <div className="w-1/2 flex flex-col justify-center gap-4 px-8">
            <div className="w-full flex flex-col gap-2">
              <Badge className="bg-purple-100 border border-purple-200 text-purple-600">
                Email Communication
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900">
                Reliable Email Delivery
              </h3>
              <p className=" text-gray-500">
                Send transactional and marketing emails with high
                deliverability, reliability, and scale — powered by a robust
                email infrastructure.
              </p>
            </div>
            <Button className="bg-transparent group-hover:bg-none group-hover:text-blue-600 border-none px-0 py-0 text-gray-500">
              Send Emails
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </ProductCard>

        <ProductCard className="group">
          <div className="w-1/2 flex flex-col justify-center gap-4 px-8">
            <div className="w-full flex flex-col gap-2">
              <Badge className="bg-green-100 border border-green-200 text-green-600">
                Product Inventory
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900">
                Product Inventory Management
              </h3>
              <p className=" text-gray-500">
                Send transactional and marketing emails with high
                deliverability, reliability, and scale — powered by a robust
                email infrastructure.
              </p>
            </div>
            <Button className="bg-transparent group-hover:bg-none group-hover:text-blue-600 border-none px-0 py-0 text-gray-500">
              Start Tracking Sales
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </ProductCard>
      </div>
    </div>
  );
};

export default Products;
