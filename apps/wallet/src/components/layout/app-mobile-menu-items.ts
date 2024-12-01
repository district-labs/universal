import { ArrowLeftRight, Banknote, Coins, KeySquare } from 'lucide-react';

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
    title: 'Authorize',
    url: '/finance/authorizations',
    icon: KeySquare,
  },
];
