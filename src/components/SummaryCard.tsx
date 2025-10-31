import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  linkPath: string;
  title: string;
  linkLabel: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
};

export default function SummaryCard({
  linkPath,
  title,
  linkLabel,
  icon: Icon,
  iconColor = "text-blue-500",
  children,
}: SummaryCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>{children}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link
            to={linkPath}
            className="font-medium text-blue-700 hover:text-blue-900"
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
