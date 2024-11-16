import {
  ArrowLeftRight,
  Banknote,
  CircleDollarSign,
  IdCard,
  LayoutDashboard,
  Search,
} from 'lucide-react';

export const itemsCore = [
  {
    title: 'Assets',
    url: '/',
    icon: LayoutDashboard,
  },
];

export const itemsFinance = [
  {
    title: 'Transfer',
    url: '/finance/transfers',
    icon: ArrowLeftRight,
  },
  {
    title: 'Authorizations',
    url: '/finance/authorization',
    icon: CircleDollarSign,
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
