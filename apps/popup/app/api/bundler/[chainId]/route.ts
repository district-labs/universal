import { chains } from '@/constants';
import { env } from '@/env';

export async function POST(
  request: Request,
  { params: { chainId } }: { params: { chainId: string } },
) {
  const chain = chains.find(({ id }) => id === Number(chainId));

  if (!chain) {
    return new Response('Chain not supported', { status: 404 });
  }

  const body = await request.json();

  const response = await fetch(
    `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error('Error inserting initial owner');
  }

  return new Response(JSON.stringify(await response.json()), { status: 200 });
}
