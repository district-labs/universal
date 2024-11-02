'use client';

import { useAccount } from 'wagmi';
import { FinanceCardView } from './view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from '@/components/ui/card';


export default function FinanceCardsPage() {
  const { address } = useAccount();

  return (
    <>
    
      <section>
      <Tabs defaultValue="account" className="w-full">
        <div className='bg-neutral-100 w-full p-3 sticky top-0 flex items-center justify-center'>
          <TabsList className='mx-auto max-w-screen-sm'>
            <TabsTrigger value="account">Send Payment Card</TabsTrigger>
            <TabsTrigger value="password">Received Payments</TabsTrigger>
          </TabsList>
        </div>
        <div className='p-8'>
          <TabsContent value="account">
              <Card className='p-0 max-w-screen-sm mx-auto'>
                <FinanceCardView />
              </Card>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </div>
      </Tabs>
        <div className='mx-auto max-w-screen-sm'>
          
        </div>
      </section>
    </>
  );
}
