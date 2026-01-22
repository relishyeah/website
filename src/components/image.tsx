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
};

export const Image = (props: ImageProps) => {
  const { src, alt, onClick } = props.data;
  const { activeImage, placeholder } = useContext(ImageContext);

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
    <motion.img
      id={props.id}
      ref={imgRef}
      src={src}
      alt={alt}
      draggable="false"
      className="p-2 w-full h-auto max-h-full object-contain "
      style={{ opacity: shouldHide ? 0 : 1 }}
      onClick={onClick}
    />
  );
};
