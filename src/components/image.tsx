import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type ImageType = {
  src: string;
  alt: string;
  filepath?: "liveMusic" | "motion";

  onClick?: () => void;
};
type ImageProps = {
  index: number;
  data: ImageType;
  id?: string;
  isCarousel?: boolean;
};

export const _Image = (props: ImageProps) => {
  const { src, alt, onClick, filepath } = props.data;
  const [loaded, setLoaded] = useState(false);

  const parts = src.split("/");
  const fileName = parts[parts.length - 1];
  const cleanName = fileName.replace(/^([^-]+-[^-]+)-.*(\.[^.]+)$/, "$1$2");

  const lowRes = `${import.meta.env.BASE_URL}assets/images/lowRes/${filepath}/${cleanName}`;

  const imgRef = useRef<HTMLImageElement | null>(null);
  const { id } = props;

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

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
        {!loaded ? (
          <motion.img
            src={lowRes}
            alt={alt}
            custom={props.index}
            initial="hidden"
            draggable="false"
            width={235}
            height={293}
            className="  transition-filter duration-500 ease-out "
            style={{
              objectFit: "fill",
              filter: "blur(16px)",
            }}
          />
        ) : (
          <motion.img
            src={src}
            alt={alt}
            custom={props.index}
            initial="hidden"
            draggable="false"
            width={235}
            height={293}
            className="  transition-filter duration-500 ease-out "
            style={{
              objectFit: "contain",
            }}
          />
        )}
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
