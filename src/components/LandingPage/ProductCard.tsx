import { ReactNode } from "react";
import { cx } from "@/utils/cx";

type ProductCardProps = {
  children: ReactNode;
  image?: string;
  className?: string;
  imgClass?: string;
};

const ProductCard = ({
  children,
  image,
  className,
  imgClass = "bg-blue-100",
}: ProductCardProps) => {
  return (
    <div
      className={cx(
        "bg-gray-100 w-full h-150 flex rounded-lg overflow-hidden",
        className
      )}
    >
      {children}
      <div className={cx("w-1/2 h-full", imgClass)}>
        {image && <img src={image} />}
      </div>
    </div>
  );
};

export default ProductCard;
