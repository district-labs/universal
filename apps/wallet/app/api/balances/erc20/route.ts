import { env } from '@/env';
import { Chain, CovalentClient } from '@covalenthq/client-sdk';
import { formatUnits, isAddress } from 'viem';
import { serialize } from 'wagmi';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chainId = searchParams.get('chainId');
    const address = searchParams.get('address');

    if (!chainId) {
      return new Response(
        JSON.stringify({
          error: 'Invalid chainId',
        }),
        {
          status: 400,
        },
      );
    }

    if (!address || (address && !isAddress(address))) {
      return new Response(
        JSON.stringify({
          error: 'Invalid address',
        }),
        {
          status: 400,
        },
      );
    }

    const client = new CovalentClient(env.COVALENT_API_KEY);
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
      chainId as Chain,
      address,
      { noNftFetch: true, noSpam: true },
    );
    // Covalent stopped return `quote` field in response, so we need to calculate it using
    // the `balance` and `quote_rate_24h` fields.
    const formattedData = resp.data?.items?.map((item: any) => {
      return {
        name: item.contract_name,
        symbol: item.contract_ticker_symbol,
        decimals: item.contract_decimals,
        balance: formatUnits(item.balance, item.contract_decimals),
        price: item?.quote_rate_24h,
        quote:
          Number(formatUnits(item.balance, item.contract_decimals)) *
          item?.quote_rate_24h,
      };
    });

    // Filter out tokens with a quote less than 1.00
    // TODO: This should be a configurable value in the UI and not hardcoded
    const filteredData = formattedData.filter((item: any) => {
      return item.quote > '1.00';
    });

    return new Response(serialize(filteredData), {
      status: 200,
    });
  } catch (e) {
    console.error(e);

    console.error(e);
    return new Response(
      JSON.stringify({
        error: 'Failed to get token balances',
      }),
      {
        status: 500,
      },
    );
  }
}
