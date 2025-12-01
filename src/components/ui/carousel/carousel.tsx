import React, { Children, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getDirection } from "@utils/get-direction";

export type CarouselPropsType = {
	className?: string;
	buttonClassName?: string;
	buttonSize?: "default" | "small";
	paginationVariant?: "default" | "circle";
	centeredSlides?: boolean;
	breakpoints?: {} | any;
	pagination?: {} | any;
	navigation?: {} | any;
	autoplay?: {
		marquee?: boolean;
		speed?: number; // px per tick
		pauseOnHover?: boolean;
		delay?: number;
	} | any;
	children?: React.ReactNode;
};

const Carousel: React.FunctionComponent<CarouselPropsType> = ({
	children,
	className = "",
	buttonClassName = "",
	buttonSize = "default",
	paginationVariant = "default",
	breakpoints,
	autoplay = {
		marquee: false,
		speed: 1,
		pauseOnHover: true,
		delay: 4000,
	},
	...props
}) => {
  // Mount gate to avoid any client-only layout mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { locale } = useRouter();
  const dir = getDirection(locale);

  // Basic scroll amount; callers control visual sizing via Tailwind classes
  const scrollAmount = buttonSize === "default" ? 320 : 260;

  // marquee auto-scroll
  const marqueeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    if (!autoplay?.marquee) return;

    const container = scrollContainerRef.current;
    const step = Math.max(0.25, Number(autoplay?.speed ?? 1)); // px per tick
    const tickMs = 16; // ~60fps

    const start = () => {
      if (marqueeRef.current) return;
      marqueeRef.current = setInterval(() => {
        if (autoplay?.pauseOnHover && isHoveringRef.current) return;
        if (!container) return;
        const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        if (atEnd) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += step;
        }
      }, tickMs);
    };

    const stop = () => {
      if (marqueeRef.current) {
        clearInterval(marqueeRef.current);
        marqueeRef.current = null;
      }
    };

    start();
    return () => stop();
  }, [autoplay?.marquee, autoplay?.speed, autoplay?.pauseOnHover]);

  const handlePrev = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (!mounted) {
    return (
      <div
        className={`carouselWrapper relative ${className} ${
          paginationVariant === "circle" ? "dotsCircle" : ""
        }`}
      >
        {children}
      </div>
    );
  }

  const slides = Children.toArray(children);

  return (
    <>
      <div
        className={`carouselWrapper relative ${className} ${
          paginationVariant === "circle" ? "dotsCircle" : ""
        }`}
        // keep any extra props for compatibility, even if unused
        {...props}
      >
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto"
          dir={dir}
          data-no-scrollbar
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => { isHoveringRef.current = true; }}
          onMouseLeave={() => { isHoveringRef.current = false; }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0">
              {slide}
            </div>
          ))}
        </div>
        <div className="flex items-center w-full absolute top-2/4 z-10">
          <button
            aria-label="prev-button"
            className={`${buttonClassName} ${
              buttonSize === "default"
                ? "w-7 h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 3xl:w-12 3xl:h-12 text-sm md:text-base lg:text-xl 3xl:text-2xl"
                : "w-7 h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 text-sm md:text-base lg:text-lg"
            } text-black flex items-center justify-center rounded-full text-gray-0 bg-white absolute transition duration-250 hover:bg-gray-900 hover:text-white focus:outline-none start-0 transform ${
              dir === "rtl"
                ? "rotate-180 shadow-navigationReverse translate-x-1/2"
                : "shadow-navigation -translate-x-1/2"
            }`}
            onClick={handlePrev}
          >
            <IoIosArrowBack />
          </button>
          <button
            aria-label="next-button"
            className={`${buttonClassName} ${
              buttonSize === "default"
                ? "w-7 h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 3xl:w-12 3xl:h-12 text-sm md:text-base lg:text-xl 3xl:text-2xl"
                : "w-7 h-7 lg:w-8 lg:h-8 text-sm md:text-base lg:text-lg"
            } text-black flex items-center justify-center rounded-full bg-white absolute transition duration-250 hover:bg-gray-900 hover:text-white focus:outline-none end-0 transform ${
              dir === "rtl"
                ? "rotate-180 shadow-navigationReverse -translate-x-1/2"
                : "shadow-navigation translate-x-1/2"
            }`}
            onClick={handleNext}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      <style jsx>{`
        [data-no-scrollbar]::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default Carousel;
