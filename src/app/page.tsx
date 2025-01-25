'use client';

import ColeProgress from '@/components/cole-progress';
import KekiProgress from '@/components/keki-progress';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen w-full py-20 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-20 justify-center items-center">
          <div className="w-full">
            <h1 className="text-3xl font-black">Never miss twice</h1>
            <p className="text-muted-foreground text-sm pt-1 lg:text-base">
              The first mistake is never the one that ruins you. It is the
              spiral of repeated mistakes that follows. Missing once is an
              accident. Missing twice is the start of a new habit - breaking it.
            </p>
            <Separator className="mt-6" />
            <ColeProgress />
          </div>
          <Separator className="stroke-black" orientation="horizontal" />
          <div className="w-full">
            <KekiProgress />
          </div>
        </div>
      </div>
    </div>
  );
}
