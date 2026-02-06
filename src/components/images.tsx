import { useState, createContext, useContext, useEffect } from "react";
import { Masonry } from "masonic";
import EmblaCarousel from "./carousel/emblaCarousel";
import { AnimatePresence, motion } from "motion/react";
import { type ImageType, Image } from "./image";
import { ANIMATION_DURATION_S } from "../constants";
import { ScrollContext } from "../routes/layout";

type ImageModule = {
  default: string; // the URL of the image
};

export interface ActiveImage {
  image: string;
  index: number;
  alt: string;
}

interface ImageContextType {
  activeImage: ActiveImage | undefined;
  setActiveImage: (img: ActiveImage | undefined) => void;

  showGallery: boolean;
  setShowGallery: (show: boolean) => void;

  showCarousel: boolean;
  setShowCarousel: (show: boolean) => void;
}

export const ImageContext = createContext<ImageContextType>({
  activeImage: undefined,
  setActiveImage: () => {},

  showGallery: true,
  setShowGallery: () => {},

  showCarousel: false,
  setShowCarousel: () => {},
});

const Images = (props: { filepath: string }) => {
  const [activeImage, setActiveImage] = useState<ActiveImage | undefined>(
    undefined,
  );
  const [showCarousel, setShowCarousel] = useState(false);
  const [showGallery, setShowGallery] = useState(true);

  const fileNames: Record<string, ImageModule> = import.meta.glob(
    "/public/assets/images/*/*.{png,jpg,jpeg,svg}",
    { eager: true },
  );

  const { isMobile } = useContext(ScrollContext);

  useEffect(() => {
    setShowCarousel(false);
    setShowGallery(true);
  }, [props.filepath]);

  useEffect(() => {
    const urls = Object.values(fileNames).map((mod) => (mod as any).default);

    urls.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  const images: ImageType[] = Object.entries(fileNames)
    .filter(([path]) =>
      path.includes(`/public/assets/images/${props.filepath}/`),
    )
    .map(([path, module], index) => {
      const alt =
        path
          .split("/")
          .pop()
          ?.replace(/\.(png|jpg|jpeg|svg)$/, "")
          ?.split("-")[1]
          ?.replace(/_/g, " ") || "";

      return {
        src: module.default,
        alt,
        onClick: () => {
          if (showCarousel) return;
          setActiveImage({ image: module.default, index, alt });
          setShowGallery(false);
          setShowCarousel(true);
        },
      };
    });

  return (
    <ImageContext.Provider
      value={{
        activeImage,
        setActiveImage,
        showGallery,
        setShowGallery,
        showCarousel,
        setShowCarousel,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION_S, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {showCarousel && activeImage && (
            <motion.div
              key="carousel"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION_S, ease: "easeInOut" }}
              className="sticky"
            >
              <EmblaCarousel
                slides={images}
                keyPrefix={props.filepath}
                setIsCarousel={setActiveImage}
                options={{ startIndex: activeImage.index, loop: true }}
              />
            </motion.div>
          )}
          {showGallery && (
            <motion.div
              key={"gird" + props.filepath}
              className="w-full h-auto relative"
              initial={{ opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION_S, ease: "easeInOut" }}
            >
              <Masonry
                key={
                  "grid" + props.filepath + (isMobile ? "mobile" : "desktop")
                }
                items={images}
                render={Image}
                style={{
                  position: "relative",
                }}
                {...(isMobile && { columnCount: 2 })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ImageContext.Provider>
  );
};

export default Images;
