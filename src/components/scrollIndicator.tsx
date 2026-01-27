import { useContext } from "react";
import { ScrollContext } from "../routes/layout";
import { AnimatePresence, motion } from "motion/react";

export const ScrollIndicator = () => {
  const { isStartup, isMobile, scrollPosition } = useContext(ScrollContext);
  const isScrolling = scrollPosition > 0.4;

  return (
    <AnimatePresence>
      {!isStartup && isMobile && !isScrolling && (
        <motion.div
          key="scrollIndicator"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 "
        >
          {[0, 1].map((i) => (
            <motion.svg
              key={i}
              className="w-8 h-8 text-red-500"
              aria-hidden="true"
              viewBox="0 0 24 24"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            >
              <path
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 9-7 7-7-7"
              />
            </motion.svg>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
