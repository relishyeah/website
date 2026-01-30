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

export function useScrollPosition(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(scrollPosition);
  const maxScrollRef = useRef(0);

  scrollRef.current = scrollPosition;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.log("test123 failed");
      return;
    }
    const handleScroll = () => {
      const y = container.scrollTop;
      console.log("test123,", y);

      if (y > maxScrollRef.current) {
        maxScrollRef.current = y;
        const pos = Math.min(maxScrollRef.current / 1000, 1);
        setScrollPosition(pos);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
  spacerEl: null as HTMLDivElement | null,
});

export default function Layout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useScrollPosition(containerRef);
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
    const headerEl = headerRef.current;
    const containerEl = containerRef.current;
    const spacerEl = spacerRef.current;
    if (!headerEl || !containerEl || !spacerEl) return;

    const handleScroll = () => {
      spacerEl.scrollIntoView({
        behavior: "smooth", // or "auto"
        block: "start", // align to top of viewport
      });
      setTimeout(() => {
        setIsVisible(false);
        setIsStartup(false);

        headerEl.removeEventListener("wheel", handleScroll);
        headerEl.removeEventListener("touchstart", handleScroll);
        headerEl.removeEventListener("touchmove", handleScroll);
      }, 1500); // runs ~150ms later
    };
    headerEl.addEventListener("wheel", handleScroll, { passive: false });

    headerEl.addEventListener("touchstart", handleScroll, {
      passive: false,
    });
    headerEl.addEventListener("touchmove", handleScroll, { passive: false });

    // Clean up everything
    return () => {
      headerEl.removeEventListener("wheel", handleScroll);
      headerEl.removeEventListener("touchstart", handleScroll);
      headerEl.removeEventListener("touchmove", handleScroll);
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
        spacerEl: spacerRef.current,
      }}
    >
      <header
        className="h-auto w-full fixed top-0 left-0  leading-20 z-100  bg-gray-100 flex flex-nowrap bg "
        style={{ marginTop: 0 }}
        ref={headerRef}
      >
        <QuinnRelyea />
      </header>

      <Sidebar />
      <div
        className="h-screen overflow-y-scroll scroll-smooth"
        ref={containerRef}
      >
        {isVisible && (
          <div ref={ref} className="w-full h-[200vh] bg-gray-100 " />
        )}
        {/* spacer for header */}
        <div
          className="w-full bg-gray-100 "
          style={{ height: `${HEADER_HEIGHT_WITH_MARGIN_VH}vh` }}
          ref={spacerRef}
        />

        <main className="flex flex-col items-end justify-center w-full bg-gray-100 ">
          <ScrollIndicator />
          {!isMobile ? <div className="basis-1/4 shrink-0 relative" /> : null}
          <div
            className=" relative min-h-[82vh] bg-gray-100 "
            style={{
              width: isMobile ? "100%" : "75%",
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </ScrollContext.Provider>
  );
}
