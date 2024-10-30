'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Toggle = React.HTMLAttributes<HTMLElement> & {
  label: string;
  handleIsTriggered: (isOn: boolean) => void;
};

const Toggle = ({ className, label, handleIsTriggered }: Toggle) => {
  const [isOn, setIsOn] = React.useState(false);

  return (
    <div className={cn('flex items-center gap-x-2', className)}>
      {label && <span className="text-xs">{label}</span>}
      <button
        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
          isOn ? 'bg-neutral-400' : 'bg-gray-300'
        }`}
        onClick={() => {
          setIsOn(!isOn);
          handleIsTriggered(!isOn);
        }}
      >
        <span className="sr-only">Toggle switch</span>
        <span
          className={`inline-block h-5 w-5 shadow-md transform rounded-full border-2 border-neutral-200 bg-white transition-transform ${
            isOn ? 'translate-x-3 border-neutral-500' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
export { Toggle };
