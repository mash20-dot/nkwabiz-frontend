import { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/cx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center px-4 cursor-pointer py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
