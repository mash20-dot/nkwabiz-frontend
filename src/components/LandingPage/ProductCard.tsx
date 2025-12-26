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
        "cursor-pointer w-full h-auto md:h-90 lg:h-120 flex flex-col md:flex-row lg:flex-row rounded-lg overflow-hidden",
        className
      )}
    >
      {children}
      <div
        className={cx(
          "w-full lg:w-1/2 pt-3 lg:pt-8 pl-3 lg:pl-8 h-70 md:h-full lg:h-full flex items-end justify-center overflow-hidden rounded-md",
          imgDivClass
        )}
      >
        {image && (
          <img
            className={cx(
              "h-full w-auto rounded-tl-sm lg:rounded-tl-md object-cover object-left",
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
