import { Duration } from 'luxon';
import { type HTMLAttributes, useMemo } from 'react';

interface DurationFromEpochProps extends HTMLAttributes<HTMLSpanElement> {
  seconds?: number | string | null;
}

export const DurationFromEpoch = ({
  className,
  seconds,
  ...props
}: DurationFromEpochProps) => {
  const timestamp = useMemo(() => {
    if (seconds) {
      return Duration.fromObject({
        days: Math.floor(Number(seconds) / 86400),
        hours: Math.floor((Number(seconds) % 86400) / 3600),
        minutes: Math.floor((Number(seconds) % 3600) / 60),
      });
    }
  }, [seconds]);

  if (!timestamp) return null;

  return (
    <span className={className} {...props}>
      {timestamp.days > 1
        ? `${timestamp.days} day${timestamp.days > 1 ? 's' : ''}`
        : null}
      {timestamp.hours > 0
        ? `${timestamp.hours} hour${timestamp.hours > 1 ? 's' : ''}`
        : null}
      {timestamp.minutes > 1
        ? `${timestamp.minutes} min${timestamp.minutes > 1 ? 's' : ''}`
        : null}
    </span>
  );
};
