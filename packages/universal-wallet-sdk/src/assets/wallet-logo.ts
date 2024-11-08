export type LogoType = 'standard';

export const walletLogo = (type: LogoType, width: number) => {
  let height;
  switch (type) {
    case 'standard':
      height = width;
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Ccircle cx='512' cy='512' r='468.114' stroke='%2312B981' stroke-width='87.7714'/%3E %3C/svg%3E`;
  }
};
