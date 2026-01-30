import { NavLink as _NavLink } from "react-router";
import { Finger } from "./finger";
import { useContext } from "react";
import { ScrollContext } from "../routes/layout";

type Props = {
  to: string;
  children: React.ReactNode;
};

const NavLink = ({ to, children }: Props) => {
  const { scrollPosition, isMobile, setShowSidebar, spacerEl, setIsVisible } =
    useContext(ScrollContext);

  const isScrolled = scrollPosition > 0.5;

  const onClickLink = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
    if (!isScrolled) {
      spacerEl?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }
  };
  return (
    <_NavLink
      to={to}
      onClick={onClickLink}
      className={({ isActive }) =>
        `text-2xl font-medium relative ${
          isActive && isScrolled
            ? "text-black"
            : "text-red-500 hover:text-black"
        }`
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <div className="flex items-center space-x-1">
          {children}
          {isActive && isScrolled && <Finger />}
        </div>
      )}
    </_NavLink>
  );
};

export default NavLink;
