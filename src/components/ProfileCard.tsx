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
        } flex-col gap-1 fixed right-4 top-16 w-[220px] bg-white shadow-lg border border-gray-200 rounded-lg p-2`}
    >
      <a href="/settings" className="w-full">
        <Tab tabName="Account Settings" icon={Settings} />
      </a>

      <Tab tabName="Sign out" icon={LogOut} onClick={onClick} />
    </aside>
  );
}