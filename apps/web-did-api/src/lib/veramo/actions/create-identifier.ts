import { veramoAgent, provider } from '../agent.js';

export function createIdentifier() {
  return veramoAgent.didManagerCreate({ provider });
}
