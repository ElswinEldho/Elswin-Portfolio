import { useEffect } from 'react';

/**
 * Desktop mouse position tracking hook for ambient hero radial glow effect.
 */
export function useMouseGlow(targetRef) {
  useEffect(() => {
    // Only enable on desktop/pointer-fine devices
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const element = targetRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      element.style.setProperty('--mouse-x', `${x}px`);
      element.style.setProperty('--mouse-y', `${y}px`);
    };

    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [targetRef]);
}
