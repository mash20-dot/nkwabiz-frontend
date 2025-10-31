import classNames from "classnames";

export default function Button({ children, className, ...rest }) {
  const generalClass =
    "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const allClasses = classNames(generalClass, className);

  return (
    <button className={allClasses} {...rest}>
      {children}
    </button>
  );
}
