'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useEffect, useState } from 'react';

type PWAInstallPrompt = React.HTMLAttributes<HTMLElement>;

export const PWAInstallPrompt = ({ className, children }: PWAInstallPrompt) => {
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
    return null;
  }

  if (isIOS) {
    return (
      <div className={cn(className)}>
        <Dialog>
          <DialogTrigger
            asChild={true}
            className={cn('cursor-pointer', className)}
          >
            {children}
          </DialogTrigger>
          <DialogContent className="text-left">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl">
                Install Universal Wallet
              </DialogTitle>
            </DialogHeader>
            <div className="content">
              <p className="text-sm">
                Universal Wallet is a Progressive Web App (PWA). You can install
                it on your device for a native app-like experience.
              </p>
              <h3 className="font-bold text-lg">iOS</h3>
              <ul className="mb-4 list-inside list-disc pl-2 text-sm">
                <li>Tap the Share button ⎋</li>
                <li>Tap "Add to Home Screen" ➕</li>
              </ul>

              <h3 className="font-bold text-lg">Android</h3>
              <ul className="mb-4 list-inside list-disc pl-2 text-sm">
                <li>
                  Tap the menu button (three dots) ⋮ in the top-right corner
                </li>
                <li>Tap "Add to Home screen" or "Install App" ➕</li>
              </ul>
              <p className="text-sm">
                The Universal Wallet icon will appear on your home screen. Use
                it to access your wallet anytime and discover what's possible.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <Dialog>
        <DialogTrigger
          asChild={true}
          className={cn('cursor-pointer', className)}
        >
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl">
              Install Universal Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="content">
            <p className="text-sm">
              Universal Wallet is a Progressive Web App (PWA). You can install
              it on your smartphone for a native app-like experience.
            </p>
            <p className="text-sm">
              Visit{' '}
              <span className="font-semibold text-blue-600">
                wallet.districtlabs.com
              </span>{' '}
              on your smartphone to set up.
            </p>

            <h3 className="font-bold text-lg">iOS</h3>
            <ul className="mb-4 list-inside list-disc pl-2 text-sm">
              <li>Tap the Share button ⎋</li>
              <li>Tap "Add to Home Screen" ➕</li>
            </ul>

            <h3 className="font-bold text-lg">Android</h3>
            <ul className="mb-4 list-inside list-disc pl-2 text-sm">
              <li>
                Tap the menu button (three dots) ⋮ in the top-right corner
              </li>
              <li>Tap "Add to Home screen" or "Install App" ➕</li>
            </ul>
            <p className="text-sm">
              The Universal Wallet icon will appear on your home screen. Use it
              to access your wallet anytime and on the go.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
