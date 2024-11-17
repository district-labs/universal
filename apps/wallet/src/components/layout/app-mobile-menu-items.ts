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
    url: '/finance/transfers',
    icon: ArrowLeftRight,
  },
  {
    title: 'Credit',
    url: '/finance/credit',
    icon: Banknote,
  },
  {
    title: 'Authorizations',
    url: '/finance/authorization',
    icon: KeySquare,
  },
  {
    title: 'Identity',
    url: '/identity/manage',
    icon: Fingerprint,
  },
];
