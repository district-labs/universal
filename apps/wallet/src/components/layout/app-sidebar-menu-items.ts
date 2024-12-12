import {
  ArrowLeftRight,
  Banknote,
  Cable,
  Coins,
  IdCard,
  KeySquare,
  LayoutList,
  Orbit,
  Rotate3D,
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
    title: 'Applications',
    url: '/applications',
    icon: Cable,
  },
  {
    title: 'Leaderboard',
    url: '/leaderboard',
    icon: Orbit,
  },
];

export const itemsFinance = [
  {
    title: 'Swap',
    url: '/finance/swap',
    icon: Rotate3D,
  },
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
