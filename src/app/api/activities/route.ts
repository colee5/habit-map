import { getActivities } from '@/lib/db/actions';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'study' | 'workout' | 'plan';
  const user = searchParams.get('user') as 'cole' | 'keki';

  try {
    const activities = await getActivities(type, user);
    return NextResponse.json(activities);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
