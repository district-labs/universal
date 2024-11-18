import {
  ArrowLeftRight,
  Banknote,
  IdCard,
  KeySquare,
  LayoutDashboard,
  Search,
  Trophy,
} from 'lucide-react';

export const itemsCore = [
  {
    title: 'Assets',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Leaderboard',
    url: '/leaderboard',
    icon: Trophy,
  },
];

export const itemsFinance = [
  {
    title: 'Transfer',
    url: '/finance/transfer',
    icon: ArrowLeftRight,
  },
  {
    title: 'Smart Links',
    url: '/finance/smart-links',
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
