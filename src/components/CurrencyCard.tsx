import Tab from "./Tab";
import { CircleDollarSign, ChevronLeft } from "lucide-react";
import { useCurrency, Currency } from "../context/CurrencyContext";
import { useState, useEffect } from "react";

type ProfileCardProps = {
  isActive?: boolean;
  onClick?: () => void;
};

const currencies: Currency[] = [
  { code: "CLP", label: "Chilean Peso" },
  { code: "USD", label: "Dollar" },
  { code: "NGN", label: "Naira" },
];

export default function CurrencyCard({ isActive, onClick }: ProfileCardProps) {
  const { currency, setCurrency } = useCurrency();
  const [selected, setSelected] = useState<string>(currency.code || "CLP");

  useEffect(() => {
    setSelected(currency.code);
  }, [currency]);

  const handleSelect = async (code: Currency["code"], label: string) => {
    setSelected(code);
    await setCurrency({ code, label });
  };
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
          {currencies.map(({ code, label }: Currency) => (
            <Tab
              key={code}
              tabName={label}
              icon={CircleDollarSign}
              onClick={() => handleSelect(code, label)}
              isSelected={selected === code}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
