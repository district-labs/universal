import {
  ArrowLeftRight,
  Banknote,
  IdCard,
  Search,
  TicketCheck,
} from 'lucide-react';

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
    title: 'Overview',
    url: '/identity/manage',
    icon: IdCard,
  },
  {
    title: 'Credentials',
    url: '/identity/credentials',
    icon: TicketCheck,
  },
];

export const itemsTesting = [
  {
    title: 'Standard',
    url: '/test/standard',
  },
];
