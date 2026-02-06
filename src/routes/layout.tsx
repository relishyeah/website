import { useEffect, useRef, useState, createContext } from "react";
import { useIsMobile } from "../utils/mobileHooks";
import { QuinnRelyea } from "../components/quinnRelyea";
import { Sidebar } from "../components/sidebar";
import { HEADER_HEIGHT_WITH_MARGIN_VH } from "../constants";
import { useLocation, useOutlet } from "react-router";
import { ScrollIndicator } from "../components/scrollIndicator";
import { AnimatePresence } from "motion/react";
import React from "react";

export const ScrollContext = createContext({
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isStartup, setIsStartup] = useState(true);
  const isMobile = useIsMobile();
  const outlet = useOutlet();
  const location = useLocation();
  const isImagesRoute =
    location.pathname === "/" || location.pathname.startsWith("/motion");

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
      // spacerEl.scrollIntoView({
      //   behavior: "smooth", // or "auto"
      //   block: "start", // align to top of viewport
      // });
      setIsVisible(false);
      setIsStartup(false);

      headerEl.removeEventListener("wheel", handleScroll);
      headerEl.removeEventListener("touchstart", handleScroll);
      headerEl.removeEventListener("touchmove", handleScroll);
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
        className="h-screen overflow-y-scroll scroll-smooth "
        ref={containerRef}
      >
        <div
          className="w-full bg-gray-100 h"
          style={{
            height: "100vh",
            maxHeight: isVisible
              ? "100vh"
              : `${HEADER_HEIGHT_WITH_MARGIN_VH}vh`,
            transition: "max-height 0.6s ease-in-out",
          }}
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
            <AnimatePresence mode="wait" initial={true}>
              {outlet &&
                React.cloneElement(outlet, {
                  key: isImagesRoute ? "images" : location.pathname,
                })}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ScrollContext.Provider>
  );
}
