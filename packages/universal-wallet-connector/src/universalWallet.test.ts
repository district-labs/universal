import { config } from '@wagmi/test';
import { expect, test } from 'vitest';

import { universalWallet } from './universalWallet.js';

test('setup', () => {
  const connectorFn = universalWallet({ appName: 'wagmi' });
  const connector = config._internal.connectors.setup(connectorFn);
  expect(connector.name).toEqual('Universal Wallet');
});
