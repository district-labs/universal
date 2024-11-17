// src/hooks/useBreakpoint.ts
import { useEffect, useState } from 'react';

export const breakpoints: { [key: string]: string } = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Custom hook to determine if the current screen width is less than or equal to the specified breakpoint.
 * @param breakpoint Tailwind CSS breakpoint key (e.g., 'sm', 'md', 'lg', 'xl', '2xl').
 * @returns Boolean indicating if the breakpoint matches.
 */
export function useBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia(
      `(max-width: ${breakpoints[breakpoint]})`,
    );
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Set the initial value
    setMatches(mediaQuery.matches);

    // Add the listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
}
