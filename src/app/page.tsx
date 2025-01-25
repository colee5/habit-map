'use client';

import ColeProgress from '@/components/cole-progress';
import KekiProgress from '@/components/keki-progress';

export default function Home() {
  return (
    <div className="flex lg:flex-row flex-col">
      <ColeProgress /> <KekiProgress />
    </div>
  );
}
