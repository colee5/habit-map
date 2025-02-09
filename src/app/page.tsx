'use client';

import { Separator } from '@/components/ui/separator';
import UserProgress from '@/components/user-progress';

export default function Home() {
  return (
    <div className="min-h-screen w-full py-20 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-20 justify-center items-center">
          <div className="w-full">
            <UserProgress user="cole" className="pb-6 pt-10" />
          </div>
          <Separator className="stroke-black" orientation="horizontal" />
          <div className="w-full">
            <UserProgress user="keki" className="py-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
