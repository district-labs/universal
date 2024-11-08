import { useQuery } from '@tanstack/react-query';

type GetBalancesERC20 = {
  chainId: number;
  address: string;
};

export function useGetBalancesERC20(params: GetBalancesERC20) {
  return useQuery({
    queryKey: ['get-balances-erc20', params],
    queryFn: () => GetBalancesERC20(params),
  });
}

export async function GetBalancesERC20(params: GetBalancesERC20) {
  const response = await fetch(
    `/api/balances/erc20?address=${params.address}&chainId=${params.chainId}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ERC20 balances');
  }

  return response.json();
}
