import { NavLink as _NavLink } from "react-router";
import { Finger } from "./finger";
import { useContext } from "react";
import { ScrollContext } from "../routes/layout";

type Props = {
  to: string;
  children: React.ReactNode;
};

const NavLink = ({ to, children }: Props) => {
  const {
    isMobile,
    setShowSidebar,
    setIsVisible,
    isVisible,
    setShowGallery,
    setShowCarousel,
    containerEl,
  } = useContext(ScrollContext);

  const onClickLink = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
    containerEl?.scrollTo({ top: 0, behavior: "instant" });
    setShowCarousel(false);
    setShowGallery(true);
    setIsVisible(false);
  };
  return (
    <_NavLink
      to={to}
      onClick={onClickLink}
      className={({ isActive }) =>
        `text-2xl font-medium relative ${
          isActive && !isVisible
            ? "text-black"
            : "text-red-500 hover:text-black"
        }`
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <div className="flex items-center space-x-1">
          {children}
          {isActive && !isVisible && <Finger />}
        </div>
      )}
    </_NavLink>
  );
};

export default NavLink;
