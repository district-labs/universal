import {
  ArrowLeftRight,
  Banknote,
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
    title: 'Send/Receive',
    url: '/finance/transfers',
    icon: ArrowLeftRight,
  },
  {
    title: 'Debit/Credit',
    url: '/finance/authorizations',
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
