import type { UseAccountStateReturnType } from '@/lib/state/use-account-state';
import { UseBundlerClientReturnType } from '@/lib/state/use-bundler-client';
import type { UseMessageContextReturnType } from '@/lib/state/use-message-context';
import type { UseSessionStateReturnType } from '@/lib/state/use-session-state';
import { NonUndefined } from '@/types/utils';

type Params = {
  accountState: UseAccountStateReturnType['accountState'];
  message: UseMessageContextReturnType['message'];
  sessionState: UseSessionStateReturnType['sessionState'];
  bundlerClient: UseBundlerClientReturnType;
};

type NonUndefinedParams = NonUndefined<{
  accountState: NonUndefined<UseAccountStateReturnType['accountState']>;
  message: NonUndefined<UseMessageContextReturnType['message']>;
  sessionState: NonUndefined<UseSessionStateReturnType['sessionState']>;
  bundlerClient: NonUndefined<UseBundlerClientReturnType> & {
    client: NonUndefined<UseBundlerClientReturnType>;
  };
}>;

export function validateMessageParams(
  params: Params,
): params is NonUndefinedParams {
  const { accountState, message, sessionState, bundlerClient } = params;

  return Boolean(
    accountState &&
      bundlerClient &&
      message?.params?.[0] &&
      sessionState?.sessionPrivateKey &&
      sessionState?.sessionPublicKey &&
      message?.requestId,
  );
}
