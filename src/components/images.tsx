import { useContext, useEffect } from "react";
import { Masonry } from "masonic";
import EmblaCarousel from "./carousel/emblaCarousel";
import { AnimatePresence, motion } from "motion/react";
import { type ImageType, _Image as Image } from "./image";
import { ANIMATION_DURATION_S } from "../constants";
import { ScrollContext } from "../routes/layout";

type ImageModule = {
  default: string; // the URL of the image
};

const Images = (props: { filepath: "liveMusic" | "motion" }) => {
  const galleries = {
    liveMusic: import.meta.glob(
      "/src/assets/images/liveMusic/*.{png,jpg,jpeg,svg}",
      { eager: true },
    ),
    motion: import.meta.glob("/src/assets/images/motion/*.{png,jpg,jpeg,svg}", {
      eager: true,
    }),
  };

  const fileNames = galleries[props.filepath] as Record<string, ImageModule>;

  const {
    isMobile,
    activeImage,
    setActiveImage,
    showGallery,
    setShowGallery,
    showCarousel,
    setShowCarousel,
  } = useContext(ScrollContext);

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

  const images: ImageType[] = Object.entries(fileNames).map(
    ([path, module], index) => {
      const filename = path.split("/").pop() || "";

      const match = filename.match(/^(\d+)-([^-]+)\.(png|jpg|jpeg|svg)$/i);

      const alt = match ? match[2].replace(/_/g, " ") : "idiot fuckong loser";

      return {
        src: module.default,
        alt,
        filepath: props.filepath,
        onClick: () => {
          if (showCarousel) return;
          setActiveImage({ image: module.default, index, alt });
          setShowGallery(false);
          setShowCarousel(true);
        },
      };
    },
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_DURATION_S, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait" initial={true}>
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
              key={"grid" + props.filepath + (isMobile ? "mobile" : "desktop")}
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
  );
};

export default Images;
