'use client';

import ColeProgress from '@/components/cole-progress';
import KekiProgress from '@/components/keki-progress';

export default function Home() {
  return (
    <div className="flex lg:flex-row px-8 gap-10 lg:px-20 lg:gap-20 flex-col">
      <ColeProgress /> <KekiProgress />
    </div>
  );
}
