import { cx } from "@/utils/cx";

type ProfileCardProps = {
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function ProfileCard({
  isActive,
  className,
  children,
  title,
}: ProfileCardProps) {
  return (
    <aside
      className={cx(
        "flex-col gap-1 fixed w-[220px]",
        "bg-white shadow-lg border border-gray-200 rounded-lg p-2",
        isActive ? "flex" : "hidden",
        className,
      )}
    >
      {title && <h2 className="text-sm font-medium text-gray-800">{title}</h2>}
      {children}
    </aside>
  );
}
