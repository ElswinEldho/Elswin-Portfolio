import { useEffect } from 'react';

/**
 * Lightweight IntersectionObserver hook for scroll-triggered reveal animations.
 * Applies the 'is-visible' CSS class to elements matching selector or ref when in viewport.
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
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '100px 0px 100px 0px',
      }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If element is already in or near viewport, reveal immediately
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector, ...deps]);
}

