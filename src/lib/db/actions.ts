import { db } from '@/db';
import { activities } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function getActivities(
  type: 'study' | 'workout',
  user: 'cole' | 'keki'
) {
  return await db
    .select()
    .from(activities)
    .where(and(eq(activities.type, type), eq(activities.user, user)));
}

export async function addActivity(
  type: 'study' | 'workout',
  date: Date,
  count: number,
  user: 'cole' | 'keki'
) {
  return await db
    .insert(activities)
    .values({
      id: crypto.randomUUID(),
      type,
      date: date.toISOString().split('T')[0],
      count,
      user,
    })
    .returning();
}
