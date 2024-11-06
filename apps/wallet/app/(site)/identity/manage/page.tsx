import * as React from 'react';
import { cn } from '@/lib/utils';

export default function IdentityManagePage() {

 return(
    <section>
        <div className={cn('container', 'mx-auto', 'px-4', 'py-16')}>
            <div className={cn('flex', 'flex-col', 'items-center', 'justify-center')}>
            <h1 className={cn('text-3xl', 'font-bold', 'text-center')}>Universal Identity</h1>
            <p className={cn('text-lg', 'text-center', 'mt-4')}>
                More Coming Soon!
            </p>
            </div>
        </div>
    </section>
)}