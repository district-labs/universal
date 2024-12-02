import {
  ArrowLeftRight,
  Banknote,
  Cable,
  Coins,
  IdCard,
  KeySquare,
  LayoutList,
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
    title: 'Credit Lines',
    url: '/finance/credit',
    icon: Banknote,
  },
  {
    title: 'Leaderboard',
    url: '/leaderboard',
    icon: Orbit,
  },
  {
    title: 'Applications',
    url: '/applications',
    icon: Cable,
  },
];

export const itemsFinance = [
  {
    title: 'Transfer',
    url: '/finance/transfer',
    icon: ArrowLeftRight,
  },
  {
    title: 'Authorize',
    url: '/finance/authorizations',
    icon: KeySquare,
  },
  {
    title: 'Redemptions',
    url: '/finance/redemptions',
    icon: LayoutList,
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
