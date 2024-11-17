import * as React from 'react';

import { ERC20_SYMBOL_TO_ICON } from '@/lib/constants/erc20';
import { cn } from '@/lib/utils';

type TokenImageWithFallbackProps = React.HTMLAttributes<HTMLElement> & {
  imgUri: string;
  symbol: string;
};

const TokenImageWithFallback = ({
  className,
  imgUri,
  symbol,
}: TokenImageWithFallbackProps) => {
  const [imgError, setImgError] = React.useState(false);
  const classes = cn(className);

  const handleImgError = () => {
    setImgError(true);
  };

  const fallbackRender = React.useMemo(() => {
    const erc20Icon = ERC20_SYMBOL_TO_ICON[symbol.toLowerCase()];

    if (erc20Icon) {
      return (
        <img
          src={erc20Icon}
          alt={symbol}
          className={`size-5 rounded-full ${classes}`}
        />
      );
    }

    return (
      <div
        className={`flex items-center justify-center ${classes} size-5 rounded-full bg-gray-200`}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }, [symbol, classes]);

  if (!imgUri) {
    return fallbackRender;
  }

  return imgError ? (
    fallbackRender
  ) : (
    <img
      src={imgUri}
      alt={symbol}
      className={`size-5 rounded-full ${classes}`}
      onError={handleImgError}
    />
  );
};

export { TokenImageWithFallback };
