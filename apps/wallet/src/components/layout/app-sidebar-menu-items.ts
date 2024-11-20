import {
  ArrowLeftRight,
  Banknote,
  Coins,
  IdCard,
  KeySquare,
  Orbit,
  Search,
} from 'lucide-react';

export const itemsCore = [
  {
    title: 'Assets',
    url: '/',
    icon: Coins,
  },
  {
    title: 'Leaderboard',
    url: '/leaderboard',
    icon: Orbit,
  },
];

export const itemsFinance = [
  {
    title: 'Transfer',
    url: '/finance/transfer',
    icon: ArrowLeftRight,
  },
  {
    title: 'Authorizations',
    url: '/finance/authorizations',
    icon: KeySquare,
  },
  {
    title: 'Credit',
    url: '/finance/credit',
    icon: Banknote,
  },
];

export const itemsIdentity = [
  {
    title: 'Manage',
    url: '/identity/manage',
    icon: IdCard,
  },
  {
    title: 'Search',
    url: '/identity/search',
    icon: Search,
  },
];

export const itemsTesting = [
  {
    title: 'Standard',
    url: '/test/standard',
  },
];
