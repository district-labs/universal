'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUser, IdCard } from 'lucide-react';
import { ViewCredentials } from './view-credentials';
import ViewDocument from './view-document';

export default function FinanceAuthorizationPage() {
  return (
    <>
      <Tabs defaultValue="account" className="flex h-full w-full flex-col p-0">
        <div className="sticky top-0 flex w-full border-b-2 bg-neutral-100/60 py-3">
          <div className="container flex flex-row items-center justify-between gap-2">
            <h3 className="font-semibold text-lg lg:text-xl">Identity</h3>
            <TabsList className="max-w-screen-sm">
              <TabsTrigger className="gap-x-2" value="account">
                <IdCard className="size-4" />
                Credentials
              </TabsTrigger>
              <TabsTrigger className="gap-x-2" value="document">
                <FileUser className="size-4" />
                Document
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
        </div>
      </Tabs>
    </>
  );
}
