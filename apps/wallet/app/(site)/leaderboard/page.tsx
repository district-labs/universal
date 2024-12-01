'use client';
import { LeaderboardApplyDialog } from '@/components/core/leaderboard-apply-dialog';
import { LeaderboardTable } from '@/components/tables/leaderboard-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Medal, Orbit } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="h-full">
      <Tabs
        defaultValue="leaderboard"
        className=" flex h-full w-full flex-col p-0"
      >
        <section className="border-b-2 bg-neutral-100/30 py-3">
          <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
            <h1 className="font-semibold text-lg lg:text-xl">Leaderboard</h1>
            <div className="flex flex-1 items-center justify-end gap-x-2">
              <TabsList className="max-w-screen-sm">
                <TabsTrigger value="leaderboard">
                  <Medal className="mr-2 size-4" />
                </TabsTrigger>
                <TabsTrigger value="information">
                  <Info className="mr-2 size-4" />
                </TabsTrigger>
              </TabsList>
              <LeaderboardApplyDialog>
                <Button rounded={'full'} className="">
                  <span className="flex items-center gap-x-1 font-bold">
                    <span className="">Join</span> <Orbit className="size-5" />{' '}
                    <span>UNV</span>
                  </span>
                </Button>
              </LeaderboardApplyDialog>
            </div>
          </div>
        </section>
        <div className="mt-6 flex-1 lg:h-auto">
          <TabsContent value="leaderboard" className="m-0 h-full p-0">
            <section>
              <div className="container max-w-[100vw] md:max-w-[1400px]">
                <Card className=" p-6 ">
                  <LeaderboardTable />
                </Card>
              </div>
            </section>
          </TabsContent>
          <TabsContent value="information" className="m-0 h-full p-0">
            <section className="h-full">
              <div className="container grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  Universal credit metrics coming soon...
                </div>
                <div className="space-y-5 lg:col-span-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-bold text-2xl">
                        How It Works
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="content">
                      <p className="text-sm leading-6">
                        UNV Network is a peer-to-peer credit network experiment.
                        Enabling users to lend and borrow from each other using
                        a web of trust model.
                      </p>
                      <p className="font-bold text-sm leading-6">
                        We are experimenting with wallet-to-wallet
                        authorizations.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-bold text-2xl">
                        Get Reward for Building Trust
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="content">
                      <p className="font-bold text-sm leading-6 ">
                        We're rewarding users for building trust in the network.
                      </p>
                      <p className="text-sm leading-6">
                        Users with the highest verifiable trust score will be
                        sent a USDC reward every month. The reward will be
                        distributed to the top 10 users with the highest trust
                        score.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
