import { Banknote, FolderKanban, Search } from 'lucide-react';

export const itemsCore = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Search,
  },
];

export const itemsFinance = [
  {
    title: 'Debit/Credit',
    url: '/finance/payments',
    icon: Banknote,
  },
];

export const itemsIdentity = [
  {
    title: 'Manage',
    url: '/identity/manage',
    icon: FolderKanban,
  },
];

export const itemsTesting = [
  {
    title: 'Standard',
    url: '/test/standard',
  },
];
