import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

export default function Button({ children, className, ...rest }: ButtonProps) {
  const generalClass =
    "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
  const allClasses = classNames(generalClass, className);

  return (
    <button
      className={
        className
          ? allClasses
          : "inline-flex items-center px-4 cursor-pointer py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      }
      {...rest}
    >
      {children}
    </button>
  );
}
