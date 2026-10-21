import { useEffect, useRef, useState } from "react";

/** Becomes true once the element scrolls into view. Skips animation if the user prefers reduced motion. */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [inView, setInView] = useState(reduced);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, threshold]);

  return { ref, inView, reduced };
}