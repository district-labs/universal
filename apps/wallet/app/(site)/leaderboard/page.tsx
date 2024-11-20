'use client';
import { LeaderboardApplyDialog } from '@/components/core/leaderboard-apply-dialog';
import { LeaderboardTable } from '@/components/tables/leaderboard-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Orbit } from 'lucide-react';

export default function LeaderbaordPage() {
  return (
    <div className="space-y-6">
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-row items-center justify-between gap-2">
          <h3 className="font-bold text-2xl">Universal Credit</h3>
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
        <div className="container">
          <Card className="p-6">
            <LeaderboardTable />
          </Card>
        </div>
      </section>
    </div>
  );
}
