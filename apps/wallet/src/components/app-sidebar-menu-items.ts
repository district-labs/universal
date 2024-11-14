import {
  ArrowLeftRight,
  Banknote,
  CircleDollarSign,
  IdCard,
  LayoutDashboard,
  Search,
  TicketCheck,
} from 'lucide-react';

export const itemsCore = [
  {
    title: 'Overview',
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
    title: 'Credit Lines',
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
    title: 'Credentials',
    url: '/identity/credentials',
    icon: TicketCheck,
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
