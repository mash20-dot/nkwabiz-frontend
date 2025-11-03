import { LucideIcon } from "lucide-react";

type TabProps = {
  tabName: string;
  icon: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function Tab({
  tabName,
  icon: Icon,
  children,
  ...rest
}: TabProps) {
  return (
    <button
      {...rest}
      className="w-full flex items-center justify-between cursor-pointer py-2 px-3"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" aria-hidden="true" />
        <p className="text-sm text-gray-600 font-normal">{tabName}</p>
      </div>
      <div className="flex items-center justify-center">{children}</div>
    </button>
  );
}
