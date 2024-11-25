'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

type Toggle = React.HTMLAttributes<HTMLElement> & {
  label: string;
  handleIsTriggered: (isOn: boolean) => void;
};

export const Toggle = ({ className, label, handleIsTriggered }: Toggle) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className={cn('flex items-center gap-x-2', className)}>
      {label && <span className="text-xs">{label}</span>}
      <button
        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
          isOn ? 'bg-neutral-400' : 'bg-gray-300'
        }`}
        type="button"
        onClick={() => {
          setIsOn(!isOn);
          handleIsTriggered(!isOn);
        }}
      >
        <span className="sr-only">Toggle switch</span>
        <span
          className={`inline-block h-5 w-5 transform rounded-full border-2 border-neutral-200 bg-white shadow-md transition-transform ${
            isOn ? 'translate-x-3 border-neutral-500' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
