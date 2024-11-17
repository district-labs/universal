// components/SvgIcon.tsx
import type React from 'react';

type SvgIconProps = {
  src: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  // biome-ignore lint/suspicious/noExplicitAny: We want to allow any other props to be passed
  [x: string]: any;
};

export const SvgIcon: React.FC<SvgIconProps> = ({
  src: Icon,
  width = '24',
  height = '24',
  color = 'currentColor',
  className = '',
  ...props
}) => {
  return (
    <Icon
      width={width}
      height={height}
      fill={color}
      className={className}
      {...props}
    />
  );
};
