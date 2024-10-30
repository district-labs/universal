import { base, baseSepolia } from 'viem/chains';

function openSeaEndpoint(chainId: number) {
  if (chainId === base.id) {
    return 'https://api.opensea.io';
  }

  return 'https://testnets-api.opensea.io';
}

const OPENSEA_NETWORKS: {
  [key: number]: string;
} = {
  [base.id]: 'base',
  [baseSepolia.id]: 'base_sepolia',
};

export async function getErc721Metadata(
  chainId: number,
  address: `0x${string}`,
) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-api-key': '7f2b65c8e6b24a848a162a0ef11abbdb',
    },
  };
  try {
    const response = await fetch(
      `${openSeaEndpoint(chainId) as string}/api/v2/chain/${
        OPENSEA_NETWORKS[chainId]
      }/contract/${address}`,
      options,
    );
    const data = await response.json();

    const collection = await fetch(
      `https://testnets-api.opensea.io/api/v2/collections/${
        data.collection as string
      }`,
      options,
    );
    const collectionData = await collection.json();

    return {
      name: collectionData.name,
      description: collectionData.description,
      external: collectionData.opensea_url,
      image: collectionData.image_url,
    };
  } catch (error) {
    console.error(error);
  }
}
