'use client';
import { Button } from '@/components/ui/button';
import { useAccountState } from '@/lib/state/use-account-state';
import { useRouter } from 'next/navigation';

export default function SignEthRequestsAccountsPage() {
  const router = useRouter();
  const { accountState, removeAccountState } = useAccountState();

  function logout() {
    // Remove the current account state and redirect to the connect page
    removeAccountState();
    router.push('/connect');
  }

  return (
    <div className="flex flex-1 w-full flex-col justify-between lg:px-20 h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-12 z-10">
        <div className="">
          <Button
            variant={'outline'}
            className="flex-1 w-full rounded-full"
            size="lg"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
