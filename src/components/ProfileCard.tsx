import Tab from "./Tab";
import { Settings, LogOut } from "lucide-react";

type ProfileCardProps = {
  onClick?: () => void;
  isActive?: boolean;
};

export default function ProfileCard({
  onClick,
  isActive,
}: ProfileCardProps) {
  return (
    <aside
      className={`${isActive ? "flex" : "hidden"
        } px-4 py-6 fixed right-4 top-16 w-[200px] bg-white shadow-md border border-gray-200 rounded-sm p-4 text-center`}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <a href="/settings" className="w-full">
            <Tab tabName="Account Settings" icon={Settings} />
          </a>

          <Tab tabName="Sign out" icon={LogOut} onClick={onClick} />
        </div>
      </div>
    </aside>
  );
}