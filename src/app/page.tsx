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
