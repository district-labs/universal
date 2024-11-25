'use client';
import { Button } from '@/components/ui/button';
import { useAccountState } from '@/lib/state/use-account-state';
import { useRouter } from 'next/navigation';

export default function SignEthRequestsAccountsPage() {
  const router = useRouter();
  const { removeAccountState } = useAccountState();

  function logout() {
    // Remove the current account state and redirect to the connect page
    removeAccountState();
    router.push('/connect');
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col justify-between lg:px-20">
      <div className="z-10 flex flex-1 flex-col items-center justify-center px-12">
        <div className="">
          <Button
            variant={'outline'}
            className="w-full flex-1 rounded-full"
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
