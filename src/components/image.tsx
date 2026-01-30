import { useContext, useEffect, useRef } from "react";
import { ImageContext } from "./images";
import { motion } from "framer-motion";

export type ImageType = {
  src: string;
  alt: string;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
};
type ImageProps = {
  index: number;
  data: ImageType;
  id?: string;
  onRectChange?: (rect: DOMRect, index: number) => void;
  initial?: any;
  animate?: any;
  transition?: any;
  onAnimationComplete?: () => void;
  isPlaceholder?: boolean;
};

export const Image = (props: ImageProps) => {
  const { src, alt, onClick } = props.data;
  const { activeImage, placeholder, showCarousel } = useContext(ImageContext);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const shouldHide = activeImage?.index === props.index && placeholder;

  useEffect(() => {
    if (!imgRef.current) return;

    const updateRect = () => {
      const rect = imgRef.current!.getBoundingClientRect();
      // Use rect here or bubble up
      if (props.onRectChange) {
        props.onRectChange(rect, props.index);
      }
    };

    updateRect();

    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [props.index, props.onRectChange, shouldHide]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <motion.img
        id={props.id}
        ref={imgRef}
        src={src}
        alt={alt}
        draggable="false"
        className={`p-2 w-full h-auto max-h-full object-contain ${props.isPlaceholder ? "fixed z-5 pointer-events-none top-0 left-0 p-2" : ""}`}
        style={{ opacity: shouldHide ? 0 : 1 }}
        onClick={onClick}
        initial={props.initial}
        animate={props.animate}
        transition={props.transition}
        onAnimationComplete={props.onAnimationComplete}
      />

      {alt && showCarousel && (
        <div className="text-center text-sm text-gray-600 mt-2">{alt}</div>
      )}
    </div>
  );
};
