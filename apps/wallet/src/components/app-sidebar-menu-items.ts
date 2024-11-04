import {
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  Banknote,
  Calendar,
  Coins,
  CreditCard,
  Earth,
  Fingerprint,
  FlaskConical,
  FolderKanban,
  Home,
  IdCard,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  Wallet,
} from 'lucide-react';

export const itemsCore = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Search,
  },
  {
    title: 'Assets',
    url: '/assets',
    icon: Wallet,
  },
];

export const itemsFinance = [
  {
    title: 'Debit Authorizations',
    url: '/finance/payments',
    icon: Banknote,
  },
  {
    title: 'Subscriptions',
    url: '/finance/subscriptions',
    icon: Calendar,
  },
];

export const itemsIdentity = [
  {
    title: 'Overview',
    url: '/identity',
    icon: IdCard,
  },
  {
    title: 'Manage',
    url: '/identity/manage',
    icon: FolderKanban,
  },
];

export const itemsActions = [
  {
    title: 'Swap',
    url: '/onchain/swap',
    icon: ArrowRightLeft,
  },
  {
    title: 'Send',
    url: '/onchain/receive',
    icon: ArrowUp,
  },
  {
    title: 'Receive',
    url: '/onchain/receive',
    icon: ArrowDown,
  },
];

export const itemsTesting = [
  {
    title: 'Standard',
    url: '/test/standard',
    // icon: ArrowRightLeft,
  },
  {
    title: 'Delegations',
    url: '/test/delegations',
    // icon: ArrowUp,
  },
];
