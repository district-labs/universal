'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUser, Info, TicketCheck } from 'lucide-react';
import { ViewCredentials } from './view-credentials';
import ViewDocument from './view-document';
import ViewOverview from './view-overview';

export default function FinanceAuthorizationPage() {
  return (
    <>
      <Tabs defaultValue="account" className="flex h-full w-full flex-col p-0">
        <div className="sticky top-0 flex w-full border-b-2 bg-neutral-100/60 py-3">
          <div className="2xl container">
            <TabsList className="max-w-screen-sm">
              <TabsTrigger className="gap-x-2" value="account">
                <TicketCheck className="size-4" />
                Credentials
              </TabsTrigger>
              <TabsTrigger className="gap-x-2" value="document">
                <FileUser className="size-4" />
                Document
              </TabsTrigger>
              <TabsTrigger className="gap-x-2" value="overview">
                <Info className="size-4" />
                Overview
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="flex-1">
          <TabsContent value="account" className="m-0 h-full p-0">
            <ViewCredentials />
          </TabsContent>
          <TabsContent value="document" className="m-0 h-full p-0">
            <ViewDocument />
          </TabsContent>
          <TabsContent value="overview" className="m-0 h-full p-0">
            <ViewOverview />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
