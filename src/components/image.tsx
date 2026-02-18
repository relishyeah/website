import { useContext, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ScrollContext } from "../routes/layout";

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

export const _Image = (props: ImageProps) => {
  const { src, alt, onClick } = props.data;

  const lowRes = src.replace("src", "public");
  const [currentSrc, setCurrentSrc] = useState(lowRes);

  const { firstLoad, setFirstLoad, showGallery } = useContext(ScrollContext);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { id } = props;
  const controls = useAnimation();

  useEffect(() => {
    if (showGallery) {
      if (firstLoad) {
        controls.start("firstLoad");
        setTimeout(() => {
          setFirstLoad(false);
        }, 1000);
      } else {
        controls.start("visible");
      }
    }
  }, [showGallery]);

  useEffect(() => {
    // Preload the high-res image
    const fullImg = new Image();
    fullImg.src = src;
    fullImg.onload = () => setCurrentSrc(src);
  }, [src]);

  const imageVariants = {
    hidden: { opacity: 0 },
    firstLoad: (custom: number) => ({
      opacity: 1,
      y: [-10, 0],
      transition: { delay: 0.56 + custom * 0.25, duration: 0.5 },
    }),
    visible: (custom: number) => ({
      opacity: 1,
      transition: { delay: 0.2 + custom * 0.1, duration: 0.5 },
    }),
  };

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
        <motion.img
          src={currentSrc}
          alt={alt}
          custom={props.index}
          initial="hidden"
          animate={controls}
          variants={imageVariants}
          draggable="false"
          width={235}
          height={293}
          className="  transition-filter duration-500 ease-out"
          style={{
            objectFit: currentSrc === lowRes ? "fill" : "contain",
            filter: currentSrc === lowRes ? "blur(16px)" : "none",
          }}
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
