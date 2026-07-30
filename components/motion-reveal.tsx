"use client";

import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type MotionRevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: "article" | "div" | "figure" | "section";
  children: ReactNode;
  delay?: number;
  direction?: "left" | "none" | "right" | "scale" | "up";
  distance?: number;
  observeOnly?: boolean;
};

const motionTargets = new Map<Element, (isInView: boolean) => void>();
let sharedMotionObserver: IntersectionObserver | null = null;

function getMotionObserver() {
  if (sharedMotionObserver) return sharedMotionObserver;

  sharedMotionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        motionTargets.get(entry.target)?.(entry.isIntersecting);
      });
    },
    { rootMargin: "5% 0px -8% 0px", threshold: 0.08 },
  );

  return sharedMotionObserver;
}

export function observeMotionElement(
  element: Element,
  onVisibilityChange: (isInView: boolean) => void,
) {
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    onVisibilityChange(true);
    return () => undefined;
  }

  let observer: IntersectionObserver | null = null;
  let observing = false;

  const startObserving = () => {
    if (observing) return;
    observing = true;
    observer = getMotionObserver();
    motionTargets.set(element, onVisibilityChange);
    observer.observe(element);
  };

  const loaderIsVisible = document.querySelector(
    ".site-loader:not(.is-hidden)",
  );

  if (loaderIsVisible && document.documentElement.dataset.siteReady !== "true") {
    window.addEventListener("dela:site-ready", startObserving, { once: true });
  } else {
    startObserving();
  }

  return () => {
    window.removeEventListener("dela:site-ready", startObserving);

    if (!observing || !observer) return;
    observer.unobserve(element);
    motionTargets.delete(element);

    if (motionTargets.size === 0) {
      observer.disconnect();
      sharedMotionObserver = null;
    }
  };
}

export function MotionReveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 30,
  observeOnly = false,
  style: customStyle,
  ...props
}: MotionRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.classList.add("is-motion-ready");

    const handleVisibility = (isInView: boolean) => {
      if (isInView) {
        element.classList.add("is-revealed", "is-in-view");
      } else {
        element.classList.remove("is-in-view");
      }
    };

    return observeMotionElement(element, handleVisibility);
  }, []);

  const style = {
    ...customStyle,
    "--motion-delay": `${delay}ms`,
    "--motion-distance": `${distance}px`,
  } as CSSProperties;

  return (
    <Tag
      ref={elementRef}
      className={`motion-reveal reveal-${direction} ${
        observeOnly ? "motion-observe-only" : ""
      } ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  );
}
