import { useRef } from "react";
import { motion } from "framer-motion";

export type ImageType = {
  src: string;
  alt: string;
  onClick?: () => void;
};
type ImageProps = {
  index: number;
  data: ImageType;
  id?: string;
  isCarousel?: boolean;
};

export const Image = (props: ImageProps) => {
  const { src, alt, onClick } = props.data;

  const imgRef = useRef<HTMLImageElement | null>(null);
  const { id } = props;
  if (!props.isCarousel) {
    return (
      <button
        id={id}
        key={id}
        onClick={onClick}
        ref={imgRef as any}
        className="p-2 w-full h-auto max-h-full"
        style={{ cursor: "pointer", background: "transparent", border: "none" }}
      >
        <img
          src={src}
          alt={alt}
          draggable="false"
          className="w-full h-auto object-contain rounded"
        />
      </button>
    );
  }

  return (
    <motion.img
      id={id}
      ref={imgRef}
      src={src}
      alt={alt}
      draggable="false"
      className="p-2 w-full h-auto max-h-full object-contain"
    />
  );
};
