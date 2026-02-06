import { useContext } from "react";
import { ScrollContext } from "../routes/layout";
import { AnimatePresence, motion } from "motion/react";

export const ScrollIndicator = () => {
  const { isStartup, isMobile, isVisible } = useContext(ScrollContext);

  return (
    <AnimatePresence>
      {!isStartup && isMobile && isVisible && (
        <motion.div
          key="scrollIndicator"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 z-101 "
        >
          {[0, 1, 2].map((i) => (
            <motion.svg
              key={i}
              className="w-6 h-6 text-red-500 z-101"
              aria-hidden="true"
              viewBox="0 0 18 18"
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
                d="m19 7-7 7-7-7"
              />
            </motion.svg>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
