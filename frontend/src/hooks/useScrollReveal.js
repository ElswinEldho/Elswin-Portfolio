import { useEffect } from 'react';

/**
 * High-performance IntersectionObserver hook for scroll-triggered reveal animations.
 * Applies the 'is-visible' CSS class to elements matching selector when entering the viewport.
 * Optimizes GPU memory by removing transform hints after transition completes.
 */
export function useScrollReveal(selector = '.reveal', deps = []) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll(selector).forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.add('is-visible');
            
            // Clean up will-change after transition completes to save GPU memory
            const handleTransitionEnd = () => {
              target.style.willChange = 'auto';
              target.removeEventListener('transitionend', handleTransitionEnd);
            };
            target.addEventListener('transitionend', handleTransitionEnd, { once: true });

            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If element is already visible in viewport on initial load, reveal immediately
      if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
        el.classList.add('is-visible');
        el.style.willChange = 'auto';
      } else {
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector, ...deps]);
}
