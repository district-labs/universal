'use client';
import { FinanceCardView } from './view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
export default function FinanceCardsPage() {
  return (
    <>
      <section>
        <Tabs defaultValue="account" className="w-full">
          <div className="bg-neutral-100 w-full p-3 sticky top-0 flex items-center justify-center">
            <TabsList className="mx-auto max-w-screen-sm">
              <TabsTrigger value="account">Create Authorization</TabsTrigger>
              <TabsTrigger value="password">
                Received Authorizations
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="px-8 pt-4">
            <TabsContent value="account" className="p-0">
              <Card className="p-0 max-w-screen-xls mx-auto">
                <FinanceCardView />
              </Card>
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </div>
        </Tabs>
        <div className="mx-auto max-w-screen-sm"></div>
      </section>
    </>
  );
}
