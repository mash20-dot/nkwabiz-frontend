import Tab from "./Tab";
import { Settings, Banknote, ChevronRight, LogOut } from "lucide-react";

type ProfileCardProps = {
  onClick?: () => void;
  isActive?: boolean;
};

export default function ProfileCard({ onClick, isActive }: ProfileCardProps) {
  return (
    <aside
      className={`${
        isActive ? "flex" : "hidden"
      } px-2 fixed right-4 top-16 w-[240px] bg-white shadow-md border border-gray-200 rounded-sm p-4 text-center`}
    >
      <div className="w-full flex flex-col ">
        <div></div>
        <div>
          <div>
            <Tab tabName="Account Settings" icon={Settings} />
            <Tab tabName="Currency" icon={Banknote}>
              <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-500" />
            </Tab>
          </div>

          <Tab tabName="Sign out" icon={LogOut} onClick={onClick} />
        </div>
      </div>
    </aside>
  );
}
