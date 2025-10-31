import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

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
    <div className="bg-white overflow-hidden border border-gray-200 hover:border-gray-300 cursor-pointer rounded-lg group">
      <div className="p-5">
        <div className="w-full flex-1">
          <dl className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <dt className="flex items-center text-sm font-normal text-gray-500 truncate">
                <Icon
                  className={`h-4 w-4 ${iconColor} mr-1`}
                  aria-hidden="true"
                />
                {title}
              </dt>
              <Link to={linkPath}>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              </Link>
            </div>

            <dd>{children}</dd>
          </dl>
        </div>
      </div>
      {/* <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link
            to={linkPath}
            className="font-medium text-blue-700 hover:text-blue-900"
          >
            {linkLabel}
          </Link>
        </div>
      </div> */}
    </div>
  );
}
