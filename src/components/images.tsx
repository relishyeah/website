import { useState, createContext, useEffect, useContext } from "react";
import { Masonry } from "masonic";
import EmblaCarousel from "./carousel/emblaCarousel";
import { motion } from "motion/react";
import { type ImageType, Image } from "./image";
import { ANIMATION_DURATION_S } from "../constants";
import { ScrollContext } from "../routes/layout";

type ImageModule = {
  default: string; // the URL of the image
};

export function MasonryClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null;
}

export interface ActiveImage {
  image: string;
  index: number;
  rect: DOMRect;
}

interface ImageContextType {
  activeImage: ActiveImage | undefined;
  setActiveImage: (img: ActiveImage | undefined) => void;

  showGallery: boolean;
  setShowGallery: (show: boolean) => void;

  showCarousel: boolean;
  setShowCarousel: (show: boolean) => void;

  placeholder: boolean;
  setPlaceholder: (placeholder: boolean) => void;
}

export const ImageContext = createContext<ImageContextType>({
  activeImage: undefined,
  setActiveImage: () => {},

  showGallery: true,
  setShowGallery: () => {},

  showCarousel: false,
  setShowCarousel: () => {},

  placeholder: false,
  setPlaceholder: () => {},
});

const Images = () => {
  const [activeImage, setActiveImage] = useState<ActiveImage | undefined>(
    undefined,
  );
  const [showCarousel, setShowCarousel] = useState(false);
  const [showGallery, setShowGallery] = useState(true);

  const [placeholder, setPlaceholder] = useState(false);

  const [targetRect, setTargetRect] = useState<DOMRect | undefined>(undefined);

  const fileNames: Record<string, ImageModule> = import.meta.glob(
    "/public/assets/images/*/*.{png,jpg,jpeg,svg}",
    { eager: true },
  );

  const { isMobile } = useContext(ScrollContext);

  const images: ImageType[] = Object.entries(fileNames).map(
    ([path, module], index) => {
      const fileName = path.split("/").pop() || "image";

      return {
        src: module.default,
        alt: fileName,
        onClick: (e) => {
          if (showCarousel) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setActiveImage({ image: module.default, index, rect });
          setPlaceholder(true);
          e.currentTarget.style.opacity = "0";
          setShowGallery(false);
        },
      };
    },
  );

  return (
    <ImageContext.Provider
      value={{
        activeImage,
        setActiveImage,
        showGallery,
        setShowGallery,
        showCarousel,
        setShowCarousel,
        placeholder,
        setPlaceholder,
      }}
    >
      <div
        className="embla absolute z-2  pointer-events-none opacity-1 bg-red-400 w-full h-full top-0 left-0"
        aria-hidden="true"
      >
        <div className="embla__viewport ">
          <div className="embla__container ">
            <div className="embla__slide ">
              {activeImage && (
                <Image
                  index={-1}
                  data={{ src: activeImage.image, alt: "" }}
                  onRectChange={setTargetRect}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {activeImage && placeholder && (
        <>
          <motion.img
            src={activeImage.image}
            initial={{
              width: activeImage.rect.width,
              height: activeImage.rect.height,
              x: activeImage.rect.x,
              y: activeImage.rect.y,
            }}
            animate={{
              width: targetRect?.width,
              height: targetRect?.height,
              x: targetRect?.x,
              y: targetRect?.y,
            }}
            transition={{ duration: ANIMATION_DURATION_S, ease: "easeInOut" }}
            className="fixed z-5000  object-contain w-full h-auto top-0 left-0 p-2"
            onAnimationComplete={() => {
              setShowCarousel(true);
            }}
          />
        </>
      )}
      {showCarousel && activeImage && (
        <motion.div
          key="carousel"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION_S, ease: "easeInOut" }}
          onAnimationComplete={() => {
            setPlaceholder(false);
          }}
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
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION_S, ease: "easeInOut" }}
        >
          <MasonryClientOnly>
            <Masonry
              items={images}
              render={Image}
              {...(isMobile && { columnCount: 2 })}
            />
          </MasonryClientOnly>
        </motion.div>
      )}
    </ImageContext.Provider>
  );
};

export default Images;
