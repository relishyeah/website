import { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ScrollContext } from "../routes/layout";
import { HEADER_HEIGHT_WITH_MARGIN_VH } from "../constants";

export const Sidebar = () => {
  const { showSidebar, setShowSidebar, isMobile } = useContext(ScrollContext);

  const [isStartup, setIsStartup] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsStartup(false);
    }, 3000);
  }, []);
  const shouldShow = (isMobile && showSidebar) || (!isMobile && !isStartup);

  const onClickLink = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
    window.scrollTo(0, 1000);
  };

  return (
    <motion.div>
      <motion.div
        className="fixed z-50 bg-gray-100 text-red-500 left-0 top-0 h-full w-full md:w-[25vw] md:translate-x-0 pl-4"
        initial={{ x: "-100%" }}
        animate={{
          x: shouldShow ? "0%" : "-100%",
          top: `${HEADER_HEIGHT_WITH_MARGIN_VH}vh`,
          opacity: isMobile ? 0.9 : 1,
        }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <ul className="flex flex-col space-y-0">
          <li className="inline-block text-xl ">
            <Link
              to="/"
              onClick={onClickLink}
              className="text-red-500 visited:text-red-500 hover:text-red-600 active:text-red-600"
            >
              Music
            </Link>
          </li>
          <li className="inline-block text-lg">
            <Link to="/motion" onClick={onClickLink}>
              Motion
            </Link>
          </li>
        </ul>

        <ul className="pt-12">
          <li className="inline-block text-lg">
            <Link to="/about" onClick={onClickLink}>
              About
            </Link>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};
