import Tab from "./Tab";
import { CircleDollarSign, ChevronLeft } from "lucide-react";

type ProfileCardProps = {
  isActive?: boolean;
  onClick?: () => void;
};

export default function CurrencyCard({ isActive, onClick }: ProfileCardProps) {
  return (
    <aside
      className={`${
        isActive ? "flex" : "hidden"
      } flex-col gap-2 px-4 py-6 fixed right-4 top-16 w-[240px] bg-white shadow-md border border-gray-200 rounded-sm p-4 text-center`}
    >
      <div className="border-b pb-1 border-gray-200">
        <Tab tabName="Back" icon={ChevronLeft} onClick={onClick} />
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-1 items-center justify-between">
          <Tab tabName="Chile" icon={CircleDollarSign} />
          <Tab tabName="Dollar" icon={CircleDollarSign} />
          <Tab tabName="Naira" icon={CircleDollarSign} />
        </div>
      </div>
    </aside>
  );
}
