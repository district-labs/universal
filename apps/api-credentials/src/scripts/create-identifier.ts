import { createIdentifier } from '../lib/veramo/actions/create-identifier.js';

async function main() {
  const identifier = await createIdentifier();
  console.log('New identifier created');
  console.log(JSON.stringify(identifier, null, 2));
}

(async () => {
  await main();
})();
