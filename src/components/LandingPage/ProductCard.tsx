import { ReactNode } from "react";
import { cx } from "@/utils/cx";

type ProductCardProps = {
  children: ReactNode;
  image?: string;
  className?: string;
  imgDivClass?: string;
  imgClass?: string;
};

const ProductCard = ({
  children,
  image,
  className,
  imgDivClass = "bg-blue-100",
  imgClass,
}: ProductCardProps) => {
  return (
    <div
      className={cx(
        "cursor-pointer w-full h-90 sm:h-100 lg:h-120 flex rounded-lg overflow-hidden",
        className
      )}
    >
      {children}
      <div
        className={cx(
          "w-1/2 pt-4 lg:pt-8 pl-4 lg:pl-8 h-full flex items-end justify-center overflow-hidden rounded-md",
          imgDivClass
        )}
      >
        {image && (
          <img
            className={cx(
              "h-full w-auto rounded-tl-md lg:rounded-tl-md object-cover object-left",
              imgClass
            )}
            src={image}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
