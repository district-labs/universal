'use client';
import { LeaderboardApplyDialog } from '@/components/core/leaderboard-apply-dialog';
import { LeaderboardTable } from '@/components/tables/leaderboard-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Orbit } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-row items-center justify-between gap-2">
          <h3 className="font-bold text-2xl">Leaderboard</h3>
          <div className="flex flex-1 items-center justify-end gap-x-2">
            <LeaderboardApplyDialog>
              <Button rounded={'lg'} className="">
                <Orbit className="size-5" />
                <span className="">
                  Join <span className="font-bold">UNV</span> Network
                </span>
              </Button>
            </LeaderboardApplyDialog>
          </div>
        </div>
      </section>
      <section>
        <div className="container max-w-[100vw] md:max-w-[1400px]">
          <Card className=" p-6 ">
            <LeaderboardTable />
          </Card>
        </div>
      </section>
    </div>
  );
}
