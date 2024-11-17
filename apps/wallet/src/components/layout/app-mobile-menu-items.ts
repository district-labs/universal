import {
  ArrowLeftRight,
  Banknote,
  Coins,
  Fingerprint,
  KeySquare,
} from 'lucide-react';

export const mobileMenu = [
  {
    title: 'Assets',
    url: '/',
    icon: Coins,
  },
  {
    title: 'Transfer',
    url: '/finance/transfer',
    icon: ArrowLeftRight,
  },
  {
    title: 'Credit',
    url: '/finance/credit',
    icon: Banknote,
  },
  {
    title: 'Smart Links',
    url: '/finance/smart-links',
    icon: KeySquare,
  },
  {
    title: 'Identity',
    url: '/identity/manage',
    icon: Fingerprint,
  },
];
