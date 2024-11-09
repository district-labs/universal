import { ArrowLeftRight, Banknote, IdCard, Search } from 'lucide-react';

export const itemsCore = [
  {
    title: 'Overview',
    url: '/',
    icon: Search,
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
];

export const itemsTesting = [
  {
    title: 'Standard',
    url: '/test/standard',
  },
];
