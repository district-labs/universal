'use client';
import type * as React from 'react';
import { useEffect, useState } from 'react';

type PWAInstallEnvironment = React.HTMLAttributes<HTMLElement>;

export const PWAInstallEnvironment = ({ children }: PWAInstallEnvironment) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window).MSStream,
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  if (isIOS) {
    return children;
  }

  return null;
};
