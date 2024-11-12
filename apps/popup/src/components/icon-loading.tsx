import type * as React from 'react';

type IconLoading = React.HTMLAttributes<HTMLElement> & {
  height?: number;
  width?: number;
};

const IconLoading = ({ height = 50, width = 50 }: IconLoading) => {
  return (
    <svg
      version="1.1"
      id="L3"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 100 100"
      enableBackground="new 0 0 0 0"
      xmlSpace="preserve"
    >
      <title>Loading</title>
      <circle
        fill="none"
        stroke="#12B981"
        strokeWidth="8"
        cx="50"
        cy="50"
        r="44"
        style={{ opacity: '0.5' }}
      />
      <circle fill="#fff" stroke="#12B981" strokeWidth="5" cx="8" cy="54" r="6">
        <animateTransform
          attributeName="transform"
          dur="2s"
          type="rotate"
          from="0 50 48"
          to="360 50 52"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
export { IconLoading };
