import { useContext } from "react";
import { motion } from "motion/react";
import { ScrollContext } from "../routes/layout";
import { HEADER_HEIGHT_WITH_MARGIN_VH } from "../constants";
import NavLink from "./navLink";

export const Sidebar = () => {
  const { showSidebar, isStartup, isMobile } = useContext(ScrollContext);
  const shouldShow = (isMobile && showSidebar) || (!isMobile && !isStartup);

  return (
    <motion.aside
      className="fixed z-102 bg-gray-100 left-0 top-0 h-full w-full md:w-[25%] md:translate-x-0 pl-6 pt-8"
      initial={{ x: "-100%" }}
      animate={{
        x: shouldShow ? "0%" : "-100%",
        top: `${HEADER_HEIGHT_WITH_MARGIN_VH}vh`,
        opacity: isMobile ? 0.9 : 1,
      }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <ul className="flex flex-col space-y-4">
        <li>
          <NavLink to="/">music</NavLink>
        </li>
        <li>
          <NavLink to="/motion">motion</NavLink>
        </li>
      </ul>

      <ul className="mt-4 flex flex-col space-y-4">
        <li>
          <NavLink to="/about">about</NavLink>
        </li>
      </ul>
    </motion.aside>
  );
};
