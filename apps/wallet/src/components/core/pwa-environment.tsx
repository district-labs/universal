'use client';
import type * as React from 'react';
import { useEffect, useState } from 'react';

type PWAEnvironment = React.HTMLAttributes<HTMLElement>;

export const PWAEnvironment = ({ children }: PWAEnvironment) => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return children;
  }

  return null;
};
