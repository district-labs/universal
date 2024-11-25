import { RowBasic } from '@/components/row-basic';
import { cn } from '@/lib/utils';
import { Fragment, useMemo } from 'react';
import type { TypedDataDefinition } from 'viem';

type GenerateEip712Items = React.HTMLAttributes<HTMLElement> & {
  data: TypedDataDefinition['message'];
};

export const GenerateEip712Items = ({
  className,
  data,
}: GenerateEip712Items) => {
  const [objKeys, objData] = useMemo(() => {
    const entries = Object.entries(data);

    // Define a ranking function for the value types
    // biome-ignore lint/suspicious/noExplicitAny: any
    const getTypeRank = (val: any) => {
      if (typeof val === 'string') return 1;
      if (typeof val === 'object') return 2;
      if (Array.isArray(val)) return 3;
      return 4; // For other types
    };

    // Sort the entries based on the defined ranking
    const sortedEntries = entries.sort((a, b) => {
      const rankA = getTypeRank(a[1]);
      const rankB = getTypeRank(b[1]);
      return rankA - rankB;
    });

    // Extract sorted keys and values
    const keys = sortedEntries.map(([key]) => key);
    const values = sortedEntries.map(([, value]) => value);

    return [keys, values];
  }, [data]);

  return (
    <div className={cn(className)}>
      {/* biome-ignore lint/suspicious/noExplicitAny: any */}
      {objData.map((item: any, index: number) => {
        return (
          <Fragment key={item}>
            {Array.isArray(item) && (
              <div className="rounded-lg">
                <h5 className="font-bold">{objKeys[index]}</h5>
                {item.map((val) => {
                  return (
                    <Fragment key={val}>
                      {typeof val === 'object' && (
                        <GenerateEip712Items data={val} />
                      )}
                      {typeof val === 'string' && (
                        <span className="mr-2">{val}</span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}
            {!Array.isArray(item) && typeof item === 'object' && (
              <div className="rounded-lg bg-neutral-100 p-3">
                <span className="font-bold capitalize">{objKeys[index]}</span>
                <GenerateEip712Items data={item} />
              </div>
            )}
            {typeof item === 'string' && (
              <RowBasic key={item} label={objKeys[index]} value={item} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
