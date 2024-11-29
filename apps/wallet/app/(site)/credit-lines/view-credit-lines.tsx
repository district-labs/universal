import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { useGetRedeemedCreditLines } from 'universal-sdk';

import { type Address, formatUnits } from 'viem';

type ViewCreditLinesProps = React.HTMLAttributes<HTMLElement> & {
  delegate: Address | undefined;
};

export const ViewCreditLines = ({
  className,
  delegate,
}: ViewCreditLinesProps) => {
  const { data, isLoading } = useGetRedeemedCreditLines({
    delegate,
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
      {data.creditLines.map(
        ({ delegation, redemptions, limit, token, totalSpent }) => (
          <Card key={delegation.hash}>
            <CardContent className="p-4">
              <div>
                Delegation: {delegation.hash} <br />
                Token: {token} <br />
                {/* TODO: Get decimals */}
                Limit: {formatUnits(BigInt(limit), 18)} <br />
                Total Spent: {formatUnits(BigInt(totalSpent), 18)} <br />
              </div>
              <div>
                <div>Redemptions:</div>
                <div>
                  {redemptions.map((redemption) => (
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
        ),
      )}
    </div>
  );
};
