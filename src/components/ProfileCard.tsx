import Tab from "./Tab";
import { Settings, Banknote, ChevronRight, LogOut } from "lucide-react";

type ProfileCardProps = {
  onClick?: () => void;
  isActive?: boolean;
  handleClick?: () => void;
};

export default function ProfileCard({
  onClick,
  isActive,
  handleClick,
}: ProfileCardProps) {
  return (
    <aside
      className={`${
        isActive ? "flex" : "hidden"
      } px-4 py-6 fixed right-4 top-16 w-[240px] bg-white shadow-md border border-gray-200 rounded-sm p-4 text-center`}
    >
      <div className="w-full flex flex-col gap-2">
        <div>
          <button className="w-full flex-1 bg-white flex items-center whitespace-nowrap gap-2 text-sm rounded-full focus:outline-none px-3 py-2 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <div className="min-h-5 min-w-5 rounded-full bg-blue-200 flex items-center justify-center">
              <span className="font-medium text-[0.5rem] text-blue-800">
                {/* Optionally show user initials or avatar */}
                SM
              </span>
            </div>
            <span className="font-medium text-gray-600 truncate">
              sakyimustapha5@gmail.com
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 items-center justify-between">
            <a href="/settings" className="w-full">
              <Tab tabName="Account Settings" icon={Settings} />
            </a>

            {/* <Tab tabName="Currency" icon={Banknote} onClick={handleClick}>
              <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
            </Tab> */}
          </div>

          <Tab tabName="Sign out" icon={LogOut} onClick={onClick} />
        </div>
      </div>
    </aside>
  );
}
