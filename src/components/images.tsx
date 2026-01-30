import { useState, createContext, useContext } from "react";
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
  rect: DOMRect;
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
        onClick: (e) => {
          if (showCarousel) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setActiveImage({ image: module.default, index, rect, alt });
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
      <AnimatePresence mode="wait">
        <div
          className="embla absolute z-2  pointer-events-none opacity-1 w-full h-full top-0 left-0"
          aria-hidden="true"
        >
          <div className="embla__viewport ">
            <div className="embla__container ">
              <div className="embla__slide ">
                {activeImage && (
                  <Image
                    index={-1}
                    data={{ src: activeImage.image, alt: "" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

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
              setIsCarousel={setActiveImage}
              options={{ startIndex: activeImage.index, loop: true }}
            />
          </motion.div>
        )}
        {showGallery && (
          <motion.div
            key="grid"
            className="w-full h-auto "
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION_S, ease: "easeInOut" }}
          >
            <Masonry
              items={images}
              render={Image}
              {...(isMobile && { columnCount: 2 })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ImageContext.Provider>
  );
};

export default Images;
