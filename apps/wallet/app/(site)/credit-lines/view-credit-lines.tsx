import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { useGetCreditLines } from 'universal-sdk';

import { type Address, formatUnits } from 'viem';
import { useChainId } from 'wagmi';

type ViewCreditLinesProps = React.HTMLAttributes<HTMLElement> & {
  delegate: Address | undefined;
};

export const ViewCreditLines = ({
  className,
  delegate,
}: ViewCreditLinesProps) => {
  const chainId = useChainId();
  const { data, isLoading } = useGetCreditLines({
    delegate,
    chainId,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-72" />;
  }

  if (data.creditLines.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="font-normal text-lg">No Credit Lines</h3>
      </Card>
    );
  }

  return (
    <div className={cn(className, 'grid grid-cols-1 gap-x-6 gap-y-10')}>
      {data.creditLines.map(({ data: delegation, metadata }) => (
        <Card key={delegation.hash}>
          <CardContent className="p-4">
            <div>
              Delegation: {delegation.hash} <br />
              Token: {metadata.token.symbol} <br />
              Limit: {metadata.limit.amountFormatted} <br />
              Total Spent: {metadata.spent.amountFormatted} <br />
            </div>
            <div>
              <div>Redemptions:</div>
              <div>
                {metadata.redemptions.map((redemption) => (
                  <div key={redemption.timestamp}>
                    {formatUnits(BigInt(redemption.redeemed), 18)} at{' '}
                    {new Date(
                      Number(redemption.timestamp) * 1000,
                    ).toISOString()}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
