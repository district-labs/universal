import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { BadgeInfo } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type {
  DelegationExecutions,
  DelegationWithMetadata,
  SocialCredential,
} from 'universal-data';
import type { DelegationDb } from 'universal-delegations-sdk';
import { useGetCreditLines } from 'universal-sdk';
import { type Address, parseUnits } from 'viem';
import { DelegationDetailsSheet } from './delegation-details-sheet';
import { AccountSocialCredentialWeightedBadge } from './identity/account-social-credential-weighted-badge';
import { Toggle } from './toggle';
import { Button } from './ui/button';
import { Card, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';

export type DelegationsManagementSheet = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onSelect'
> & {
  address: Address;
  chainId: number;
  onSelect: (delegation: DelegationExecutions[]) => void;
};

export const DelegationsManagementSheet = ({
  children,
  className,
  address,
  chainId,
  onSelect,
}: DelegationsManagementSheet) => {
  const { data } = useGetCreditLines({
    delegate: address,
    chainId,
  });

  const creditLines = useMemo(() => {
    if (!data?.creditLines) return;
    // Filter out credit lines with no available balance
    return data.creditLines.filter(
      (delegation) =>
        Number(delegation.metadata.available.amount) > 0 &&
        !delegation.data.isRevoked,
    );
  }, [data?.creditLines]);

  const [isOpen, toggleIsOpen] = useState(false);
  const [delegationExecutions, setDelegationExecutions] = useState<
    DelegationExecutions[]
  >([]);

  useEffect(() => {
    if (!isOpen) {
      setDelegationExecutions([]);
    }
  }, [isOpen]);

  const handleDisableDelegation = (
    hash: DelegationWithMetadata['data']['hash'],
  ) => {
    setDelegationExecutions(
      delegationExecutions.filter(
        (delegationExecution) => delegationExecution.delegation.hash !== hash,
      ),
    );
  };

  const handleDelegationAmountUpdate = (
    hash: DelegationWithMetadata['data']['hash'],
    amountFormatted: string,
  ) => {
    setDelegationExecutions(
      delegationExecutions.map((delegationExecution) => {
        if (delegationExecution.delegation.hash === hash) {
          return {
            ...delegationExecution,
            execution: {
              ...delegationExecution.execution,
              amountFormatted,
              amount: parseUnits(
                amountFormatted,
                delegationExecution.token.decimals,
              ),
            },
          };
        }
        return delegationExecution;
      }),
    );
  };

  const handleEnableDelegation = (
    delegationExecution: DelegationWithMetadata,
  ) => {
    setDelegationExecutions([
      ...delegationExecutions,
      {
        delegation: delegationExecution.data,
        execution: {
          hash: delegationExecution.data.hash,
          amount: BigInt(0),
          amountFormatted: '0',
          total: BigInt(delegationExecution.metadata.limit.amount),
          totalFormatted: delegationExecution.metadata.limit.amountFormatted,
          spentMapAfter:
            BigInt(delegationExecution.metadata.limit.amount) -
            BigInt(delegationExecution.metadata.spent.amount),
          spentMapAfterFormatted:
            delegationExecution.metadata.limit.amountFormatted,
        },
        token: delegationExecution.metadata.token,
      },
    ]);
  };

  const handleOnSelect = () => {
    onSelect(delegationExecutions);
    toggleIsOpen(false);
  };

  return (
    <div className={cn(className)}>
      <Sheet open={isOpen}>
        <SheetTrigger asChild={true} onClick={() => toggleIsOpen(!isOpen)}>
          {children}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="top-0 space-y-3 overflow-auto pt-2 pb-20"
          isCloseDisabled={true}
        >
          <SheetHeader>
            <SheetTitle className="text-2xl">Credit Lines</SheetTitle>
            <SheetDescription className="text-base">
              Select a credit line to use for this transaction.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {(creditLines?.length ?? 0) === 0 && (
              <Card className="flex items-center justify-center p-4">
                <span className="font-semibold text-base text-neutral-500">
                  No spending allowances available
                </span>
              </Card>
            )}

            {(creditLines?.length ?? 0) > 0 &&
              (creditLines ?? []).map((delegation) => (
                <CreditDelegationCard
                  toggleIsOpen={toggleIsOpen}
                  handleEnableDelegation={handleEnableDelegation}
                  handleDisableDelegation={handleDisableDelegation}
                  handleDelegationAmountUpdate={handleDelegationAmountUpdate}
                  key={delegation.data.hash}
                  delegationWithMetadata={delegation}
                  delegation={delegation.data}
                  delegatorAccountSocialCredentials={
                    (data?.credentials[delegation.data.delegator]
                      ?.credentials ?? []) as SocialCredential[]
                  }
                />
              ))}
          </div>
          <div className="fixed right-0 bottom-0 left-0 flex gap-x-4 border-t-2 bg-white px-4 py-3">
            <Button
              onClick={() => {
                onSelect([]);
                toggleIsOpen(false);
              }}
              variant={'outline'}
              className="w-full rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleOnSelect} className="w-full rounded-full">
              Apply
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

type CreditDelegationCard = Omit<
  React.HTMLAttributes<HTMLElement>,
  'handleEnableDelegation'
> & {
  delegatorAccountSocialCredentials: SocialCredential[];
  delegation: DelegationDb;
  delegationWithMetadata: DelegationWithMetadata;
  handleEnableDelegation: (delegation: DelegationWithMetadata) => void;
  handleDisableDelegation: (hash: DelegationDb['hash']) => void;
  handleDelegationAmountUpdate: (
    hash: DelegationDb['hash'],
    amountFormatted: string,
  ) => void;
  toggleIsOpen: (isOpen: boolean) => void;
};

const CreditDelegationCard = ({
  delegatorAccountSocialCredentials,
  delegation,
  delegationWithMetadata,
  handleEnableDelegation,
  handleDisableDelegation,
  handleDelegationAmountUpdate,
}: CreditDelegationCard) => {
  const [isEnabled, setIsEnabled] = useState<boolean>();
  const [pullAmount, setPullAmount] = useState<string>();

  return (
    <Card
      key={delegation.hash}
      className={cn('flex flex-col gap-y-3 px-3 pt-0 pb-2 hover:shadow-md', {
        'border-neutral-400': isEnabled,
      })}
    >
      <CardHeader
        className={cn('flex flex-row items-start justify-between p-0', {
          'opacity-60': !isEnabled,
        })}
      >
        <div className={cn('mt-4 flex flex-col gap-y-3')}>
          <div className="flex items-center gap-x-1.5">
            <Image
              width={20}
              height={20}
              className="size-5 rounded-full"
              src={delegationWithMetadata.metadata.token.logoURI}
              alt={delegationWithMetadata.metadata.token.name}
            />
            <div className="space-y-0">
              <h3 className="font-black text-xl leading-3">{`${delegationWithMetadata.metadata.token.symbol}`}</h3>
            </div>
          </div>
          <DelegationDetailsSheet
            credentials={delegatorAccountSocialCredentials}
            delegation={delegationWithMetadata}
          >
            <span className="flex cursor-pointer items-center gap-x-1 font-semibold text-xs">
              Authorization
              <BadgeInfo className="size-3" />
            </span>
          </DelegationDetailsSheet>
        </div>
        <div className="flex flex-col items-end justify-start space-y-1">
          <span className="font-bold text-4xl">
            <Input
              disabled={!isEnabled}
              placeholder={
                isEnabled
                  ? '0.0'
                  : `${delegationWithMetadata.metadata.available.amountFormatted}.0`
              }
              value={pullAmount}
              onChange={(e) => {
                setPullAmount(e.target.value);
                handleDelegationAmountUpdate(
                  delegationWithMetadata.data.hash,
                  e.target.value || '0',
                );
              }}
              className={cn(
                'max-w-[200px] border-transparent pr-0 text-right text-4xl shadow-none placeholder:text-neutral-600 focus-visible:ring-0',
                {
                  'text-neutral-500': !isEnabled,
                  'placeholder:text-neutral-300': isEnabled,
                  'text-red-500':
                    Number(
                      delegationWithMetadata.metadata.available.amountFormatted,
                    ) < Number(pullAmount) || '',
                },
              )}
            />
          </span>
          <div className="flex items-center gap-x-0.5">
            <span className="font-semibold text-xs">{`${delegationWithMetadata.metadata.available.amountFormatted} ${delegationWithMetadata.metadata.token.symbol}`}</span>
            <span
              className="cursor-pointer bg-neutral-100 p-1 text-xs hover:bg-neutral-200/50"
              onClick={
                isEnabled
                  ? () => {
                      setPullAmount(
                        delegationWithMetadata.metadata.available
                          .amountFormatted,
                      );
                      handleDelegationAmountUpdate(
                        delegationWithMetadata.data.hash,
                        delegationWithMetadata.metadata.available
                          .amountFormatted,
                      );
                    }
                  : () => {}
              }
            >
              Max
            </span>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-t-2 p-0 pt-2">
        <div className="flex items-center gap-x-1">
          <AccountSocialCredentialWeightedBadge
            className="text-xs"
            address={delegationWithMetadata.data.delegator}
            credentials={delegatorAccountSocialCredentials}
          />
        </div>
        <div className="flex items-center gap-x-1">
          {isEnabled ? (
            <span className="font-bold text-xs">Enabled</span>
          ) : (
            <span className="text-xs">Disabled</span>
          )}
          <Toggle
            label=""
            handleIsTriggered={(isEnabled) => {
              isEnabled
                ? handleEnableDelegation(delegationWithMetadata)
                : handleDisableDelegation(delegationWithMetadata.data.hash);
              setIsEnabled(isEnabled);
              setPullAmount('');
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
