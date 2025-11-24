import { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
};

export default function SummaryCard({
  title,
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
            </div>

            <dd>{children}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
