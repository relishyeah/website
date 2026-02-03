import { useRef } from "react";
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
};

export const Image = (props: ImageProps) => {
  const { src, alt, onClick } = props.data;

  const imgRef = useRef<HTMLImageElement | null>(null);

  return (
    <motion.img
      id={props.id}
      ref={imgRef}
      src={src}
      alt={alt}
      draggable="false"
      className={`p-2 w-full h-auto max-h-full object-contain `}
      onClick={onClick}
      initial={props.initial}
      animate={props.animate}
      transition={props.transition}
      onAnimationComplete={props.onAnimationComplete}
    />
  );
};
