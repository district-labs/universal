import { provider, veramoAgent } from '../agent.js';

export function createIdentifier() {
  return veramoAgent.didManagerCreate({ provider });
}
