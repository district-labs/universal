'use client';
import { LeaderboardApplyDialog } from '@/components/core/leaderboard-apply-dialog';
import { LeaderboardMetricsTable } from '@/components/tables/leaderboard-metrics-table';
import { LeaderboardTable } from '@/components/tables/leaderboard-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Info, Medal, Orbit, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="h-full pb-10">
      <Tabs
        defaultValue="leaderboard"
        className=" flex h-full w-full flex-col p-0"
      >
        <section className="border-b-2 bg-neutral-100/30 py-3">
          <div className="container flex w-full flex-row items-center justify-between gap-2 md:flex-row">
            <h1 className="font-semibold text-lg lg:text-xl">Leaderboard</h1>
            <div className="flex flex-1 items-center justify-between gap-x-2">
              <TabsList className="max-w-screen-sm">
                <TabsTrigger value="leaderboard">
                  <Medal className="size-4" />
                </TabsTrigger>
                <TabsTrigger value="information">
                  <Info className="size-4" />
                </TabsTrigger>
              </TabsList>
              <LeaderboardApplyDialog>
                <Button rounded={'full'} className="" size="sm">
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
              <div className="container grid grid-cols-1 gap-x-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                  <Card className=" p-6 ">
                    <LeaderboardMetricsTable />
                  </Card>
                </div>
                <div className="space-y-5 lg:col-span-4">
                  <Card>
                    <CardHeader>
                      <Coins className="size-8" />
                      <CardTitle className="font-bold text-2xl">
                        Get Rewarded for Trust
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="content">
                      <p className="font-bold text-sm leading-6 ">
                        We're rewarding users for building a web of trust.
                      </p>
                      <p className="text-sm leading-6">
                        Users with the highest verifiable trust score will be
                        sent a USDC reward every month.
                      </p>
                      <p className="text-sm leading-6">
                        The reward will be distributed to the top 10 users with
                        the highest trust score.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Trophy className="size-8" />
                      <CardTitle className="font-bold text-2xl">
                        Trust Score Multiplier
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="content">
                      <p className="text-sm leading-6">
                        Each asset has a unique trust score multiplier.
                      </p>
                      <p className="text-sm leading-6">
                        Users with the highest peer-to-peer credit scores wil
                        have a higher universal trust score.
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
