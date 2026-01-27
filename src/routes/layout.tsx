import { AnimatePresence } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  createContext,
  useLayoutEffect,
} from "react";
import { useIsMobile } from "../utils/mobileHooks";
import { QuinnRelyea } from "../components/quinnRelyea";
import { Sidebar } from "../components/sidebar";
import { HEADER_HEIGHT_WITH_MARGIN_VH } from "../constants";
import { Outlet } from "react-router";
import { ScrollIndicator } from "../components/scrollIndicator";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(scrollPosition);
  const maxScrollRef = useRef(0);

  scrollRef.current = scrollPosition;

  useLayoutEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > maxScrollRef.current) {
        maxScrollRef.current = y;
        const pos = Math.min(maxScrollRef.current / 1000, 1);
        setScrollPosition(pos);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // still only attach listener once

  return scrollRef.current;
}

export const ScrollContext = createContext({
  scrollPosition: 0,
  showSidebar: false,
  setShowSidebar: (b: boolean) => {
    b;
  },
  isMobile: false,
  isVisible: true,
  setIsVisible: (b: boolean) => {
    b;
  },
  isStartup: true,
  setIsStartup: (b: boolean) => {
    b;
  },
});

export default function Layout() {
  const scrollPosition = useScrollPosition();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isStartup, setIsStartup] = useState(true);

  const isMobile = useIsMobile();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsStartup(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setIsVisible(false);
            observer.disconnect(); // stop observing
          }
        });
      },
      { threshold: 0 }, // "0" fires as soon as any pixel is visible / becomes invisible
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        scrollPosition,
        showSidebar,
        setShowSidebar,
        isMobile,
        isVisible,
        setIsVisible,
        isStartup,
        setIsStartup,
      }}
    >
      <header
        className="h-auto w-[200%] fixed top-0 left-0  leading-20 z-10  bg-gray-100 flex flex-nowrap bg overflow-x-hidden"
        style={{ marginTop: 0 }}
      >
        <QuinnRelyea />
      </header>

      <Sidebar />
      {isVisible && (
        <div ref={ref} className="w-screen h-[166.5vh] bg-gray-100" />
      )}
      <div
        className="w-screen bg-gray-100"
        style={{ height: `${HEADER_HEIGHT_WITH_MARGIN_VH}vh` }}
      />

      <div className="bg-gray-100 w-full h-auto flex  overflow-clip">
        {!isMobile && <div className="w-[25vw] relative" />}
      </div>
      <main className="flex flex-col items-end justify-center w-screen bg-gray-100 ">
        <AnimatePresence mode="sync">
          <ScrollIndicator />
          <div
            className=" relative min-h-[82vh] bg-gray-100"
            style={{
              width: isMobile ? "100vw" : "75vw",
            }}
          >
            <Outlet />
          </div>
        </AnimatePresence>
      </main>
    </ScrollContext.Provider>
  );
}
